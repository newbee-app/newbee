import { BaseUpdateOrganizationDto } from '@newbee/shared/data-access';
import { displayNameIsNotEmpty, nameIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrganizationDto implements BaseUpdateOrganizationDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  displayName?: string | null;
}
