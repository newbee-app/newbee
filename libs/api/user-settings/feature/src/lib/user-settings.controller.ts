import {
  Body,
  Controller,
  Logger,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import { UserSettingsService } from '@newbee/api/user-settings/data-access';
import { BaseUpdateUserSettingsDto } from '@newbee/shared/data-access';

@Controller({ path: 'user-settings', version: '1' })
export class UserSettingsController {
  private readonly logger = new Logger(UserSettingsController.name);

  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserSettingsDto: BaseUpdateUserSettingsDto
  ): Promise<UserSettingsEntity> {
    this.logger.log(
      `Update user settings request received for id: ${id}: ${JSON.stringify(
        updateUserSettingsDto
      )}`
    );
    const userSettings = await this.userSettingsService.update(
      id,
      updateUserSettingsDto
    );
    if (!userSettings) {
      const errorMsg = `User settings not found for id: ${id}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.logger.log(`Updated user settings: ${JSON.stringify(userSettings)}`);
    return userSettings;
  }
}
