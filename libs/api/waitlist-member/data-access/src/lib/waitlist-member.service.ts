import {
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EntityService,
  UserDocParams,
  UserEntity,
  WaitlistDocParams,
  WaitlistMemberEntity,
} from '@newbee/api/shared/data-access';
import { AppConfig, solrAppCollection } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  CreateWaitlistMemberDto,
  OffsetAndLimit,
  UserRoleEnum,
  alreadyOnWaitlistBadRequest,
  emailAlreadyRegisteredBadRequest,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';

/**
 * The service that interacts with the `WaitlistMemberEntity`.
 */
@Injectable()
export class WaitlistMemberService {
  private readonly logger = new Logger(WaitlistMemberService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly mailerService: MailerService,
    private readonly entityService: EntityService,
    private readonly userInvitesService: UserInvitesService,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new waitlist member using the given details.
   *
   * @param createWaitlistMemberDto The details for the new waitlist member.
   *
   * @returns The waitlist member that was added to the waitlist.
   * @throws {BadRequestException} `emailAlreadyRegisteredBadRequest`, `alreadyOnWaitlistBadRequest`. If the given email is already a user or a waitlist member.
   */
  async create(
    createWaitlistMemberDto: CreateWaitlistMemberDto,
  ): Promise<WaitlistMemberEntity> {
    const { email, name } = createWaitlistMemberDto;
    if (await this.userService.findOneByEmailOrNull(email)) {
      throw new BadRequestException(emailAlreadyRegisteredBadRequest);
    }

    const adminControls = await this.entityService.getAdminControls();
    const waitlistMember = await this.em.transactional(
      async (em): Promise<WaitlistMemberEntity> => {
        const waitlistMember = new WaitlistMemberEntity(
          email,
          name,
          adminControls,
        );
        try {
          await em.persistAndFlush(waitlistMember);
        } catch (err) {
          if (err instanceof UniqueConstraintViolationException) {
            this.logger.error(err);
            throw new BadRequestException(alreadyOnWaitlistBadRequest);
          }

          throw err;
        }

        await this.solrCli.addDocs(
          solrAppCollection,
          new WaitlistDocParams(waitlistMember),
        );
        return waitlistMember;
      },
    );

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You're on the waitlist`,
        text: `You have successfully been added to the NewBee waitlist!\nPlease look out for another email from us when you are accepted off of the waitlist.\nThank you for your interest in NewBee.`,
        html: `<p>You have successfully been added to the NewBee waitlist!</p><p>Please look out for another email from us when you are accepted off of the waitlist.</p><p>Thank you for your interest in NewBee.</p>`,
      });
    } catch (err) {
      this.logger.error(err);
    }

    return waitlistMember;
  }

  /**
   * Find the waitlist member associated with the email, or `null` if none exist.
   *
   * @param email The email to look for.
   *
   * @returns The waitlist member associated with the email, `null` if none exist.
   */
  async findByEmailOrNull(email: string): Promise<WaitlistMemberEntity | null> {
    return await this.em.findOne(WaitlistMemberEntity, { email });
  }

  /**
   * Gets all of the waitlist member entities.
   *
   * @param offsetAndLimit The offset and limit of the waitlist members to get.
   *
   * @returns A tuple containing the waitlist member entities and a count of the toal number of waitlist members.
   */
  async getAllAndCount(
    offsetAndLimit: OffsetAndLimit,
  ): Promise<[WaitlistMemberEntity[], number]> {
    const { offset, limit } = offsetAndLimit;
    return await this.em.findAndCount(
      WaitlistMemberEntity,
      {},
      { offset, limit, orderBy: { createdAt: QueryOrder.ASC } },
    );
  }

  /**
   * Delete waitlist members and create new users in their place.
   *
   * @param waitlistMembers The waitlist members to turn into users.
   *
   * @returns The users made from waitlist members.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueContraintViolationException`.
   */
  async deleteAndCreateUsers(
    waitlistMembers: WaitlistMemberEntity[],
  ): Promise<UserEntity[]> {
    const waitlistAsIds = waitlistMembers.map((waitlistMember) => ({
      id: waitlistMember.id,
    }));
    const users = await Promise.all(
      waitlistMembers.map(async (waitlistMember) => {
        const { email, name } = waitlistMember;
        const userInvites =
          await this.userInvitesService.findOrCreateOneByEmail(email);
        const user = new UserEntity(
          v4(),
          email,
          name,
          null,
          null,
          null,
          UserRoleEnum.User,
          userInvites,
        );
        return user;
      }),
    );
    const userDocParams = users.map((user) => new UserDocParams(user));

    await this.em.transactional(async (em): Promise<void> => {
      try {
        em.persist(users);
        em.remove(waitlistMembers);
        await em.flush();
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          this.logger.error(err);
          throw new BadRequestException(userEmailTakenBadRequest);
        }

        throw err;
      }

      await this.solrCli.bulkDocRequest(solrAppCollection, {
        add: userDocParams,
        delete: waitlistAsIds,
      });
    });

    const link = this.configService.get('rpInfo.origin', { infer: true });
    for (const user of users) {
      const { email, name } = user;
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: `You're off the waitlist!`,
          text: `Congratulations ${name}, you're off the waitlist! You should have also gotten an email to verify your new account. Please click here to start using NewBee: ${link}`,
          html: `<p>Congratulations ${name}, you're off the waitlist!</p><p>You should have also gotten an email to verify your new account.</p><p>Please click here to start using NewBee: <a href="${link}">${link}</a></p>`,
        });
      } catch (err) {
        this.logger.error(err);
        continue;
      }
    }

    try {
      await this.userService.sendVerificationEmail(users);
    } catch (err) {
      this.logger.error(err);
    }

    return users;
  }
}
