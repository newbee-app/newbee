import {
  Body,
  Controller,
  Logger,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UserSettings } from '@newbee/api/shared/data-access';
import { UserSettingsService } from '@newbee/api/user-settings/data-access';
import { UpdateUserSettingsDto } from '@newbee/api/user-settings/util';

@Controller('user-settings')
export class UserSettingsController {
  private readonly logger = new Logger(UserSettingsController.name);

  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto
  ): Promise<UserSettings> {
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
