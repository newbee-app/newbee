import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserSettingsEntity } from '@newbee/api/shared/data-access';
import { CreateUserDto, UpdateUserDto } from '@newbee/shared/data-access';
import { NameDisplayFormat } from '@newbee/shared/util';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.save(
        new UserEntity({ ...createUserDto, active: true, online: false })
      );
      await queryRunner.manager.save(
        new UserSettingsEntity({
          user,
          nameDisplayFormat: user.displayName
            ? NameDisplayFormat.DISPLAY_NAME
            : NameDisplayFormat.FIRST_LAST,
        })
      );
      await queryRunner.commitTransaction();

      return user;
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();

      this.logger.error(err);
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    if (!user) {
      return null;
    }

    return await this.userRepository.save(
      new UserEntity({ ...updateUserDto, id })
    );
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findOneById(id);
    if (!user) {
      return false;
    }

    await this.userRepository.remove(user);
    return true;
  }
}
