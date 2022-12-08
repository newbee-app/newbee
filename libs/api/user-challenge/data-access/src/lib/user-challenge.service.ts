import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';

@Injectable()
export class UserChallengeService {
  private readonly logger = new Logger(UserChallengeService.name);

  constructor(
    @InjectRepository(UserChallengeEntity)
    private readonly userChallengeRepository: EntityRepository<UserChallengeEntity>
  ) {}

  async findOneById(id: string): Promise<UserChallengeEntity> {
    try {
      return await this.userChallengeRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user challenge', 'an', 'ID', id)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findOneByEmail(email: string): Promise<UserChallengeEntity> {
    try {
      return await this.userChallengeRepository.findOneOrFail({
        user: { email },
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user challenge', 'an', 'email', email)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async update(
    userChallenge: UserChallengeEntity,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    const updatedUserChallenge = this.userChallengeRepository.assign(
      userChallenge,
      { challenge }
    );
    await this.userChallengeRepository.flush();
    return updatedUserChallenge;
  }

  async updateById(
    id: string,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    let userChallenge = await this.findOneById(id);
    userChallenge = await this.update(userChallenge, challenge);
    return userChallenge;
  }

  async updateByEmail(
    email: string,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    let userChallenge = await this.findOneByEmail(email);
    userChallenge = await this.update(userChallenge, challenge);
    return userChallenge;
  }
}
