import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettings } from '@newbee/api/shared/data-access';
import { UpdateUserSettingsDto } from '@newbee/api/user-settings/util';
import { UserService } from '@newbee/api/user/data-access';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
    private readonly userService: UserService
  ) {}

  async findOneById(id: string): Promise<UserSettings | null> {
    return await this.userSettingsRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateUserSettingsDto: UpdateUserSettingsDto
  ): Promise<UserSettings | null> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      return null;
    }

    return await this.userSettingsRepository.save(
      new UserSettings({ ...updateUserSettingsDto, user })
    );
  }
}
