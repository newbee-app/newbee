import { BaseUpdateUserSettingsDto } from '@newbee/shared/data-access';
import { NameDisplayFormat } from '@newbee/shared/util';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto implements BaseUpdateUserSettingsDto {
  @IsOptional()
  @IsEnum(NameDisplayFormat)
  nameDisplayFormat?: NameDisplayFormat;
}
