import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import {
  AppConfigInterface,
  createConflictLogMsg,
  idNotFoundErrorMsg,
  idNotFoundLogMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import type { UserAndOptions } from '@newbee/api/user/util';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AppConfigInterface, true>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserAndOptions> {
    const { email } = createUserDto;
    if (await this.findOneByEmail(email)) {
      this.logger.error(createConflictLogMsg('a', 'user', 'email', email));
      throw new BadRequestException(
        `The email ${email} is already taken, please use a different email or log in to your existing account!`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.save(
        new UserEntity({ ...createUserDto, active: true, online: false })
      );
      await queryRunner.manager.save(new UserSettingsEntity({ user }));

      const rpInfo = this.configService.get('rpInfo', { infer: true });
      const options = generateRegistrationOptions({
        rpName: rpInfo.name,
        rpID: rpInfo.id,
        userID: user.id,
        userName: user.email,
        userDisplayName: user.displayName ?? user.name,
      });
      await queryRunner.manager.save(
        new UserChallengeEntity({ user, challenge: options.challenge })
      );

      await queryRunner.commitTransaction();
      return { user, options };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    } finally {
      queryRunner.release();
    }
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) {
      this.logger.error(idNotFoundLogMsg('update', 'a', 'user', 'ID', id));
      throw new NotFoundException(
        idNotFoundErrorMsg('a', 'user', 'an', 'ID', id)
      );
    }

    try {
      return await this.userRepository.save(
        new UserEntity({ ...user, ...updateUserDto })
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      this.logger.error(idNotFoundLogMsg('delete', 'a', 'user', 'ID', id));
      throw new NotFoundException(
        idNotFoundErrorMsg('a', 'user', 'an', 'ID', id)
      );
    }

    try {
      await this.userRepository.remove(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }
}
