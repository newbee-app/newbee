import { NameDisplayFormat } from '@newbee/shared/util';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsEnum(NameDisplayFormat)
  nameDisplayFormat?: NameDisplayFormat;
}
