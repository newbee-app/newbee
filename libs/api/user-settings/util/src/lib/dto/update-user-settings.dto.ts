import { NameDisplayFormat } from '@newbee/api/shared/util';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsEnum(NameDisplayFormat)
  nameDisplayFormat?: NameDisplayFormat;
}
