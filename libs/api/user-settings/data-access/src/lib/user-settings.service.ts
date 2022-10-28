import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { Repository } from 'typeorm';
import { UpdateUserSettingsDto } from './dto';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
    private readonly userService: UserService
  ) {}

  async findOneById(id: string): Promise<UserSettingsEntity | null> {
    return await this.userSettingsRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateUserSettingsDto: UpdateUserSettingsDto
  ): Promise<UserSettingsEntity | null> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      return null;
    }

    return await this.userSettingsRepository.save(
      new UserSettingsEntity({ ...updateUserSettingsDto, user })
    );
  }
}
