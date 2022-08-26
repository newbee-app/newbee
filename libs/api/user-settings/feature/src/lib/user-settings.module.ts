import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import { UserSettingsService } from '@newbee/api/user-settings/data-access';
import { UserModule } from '@newbee/api/user/feature';
import { UserSettingsController } from './user-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettingsEntity]), UserModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
