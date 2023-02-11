import { BaseUpdateOrganizationDto } from '@newbee/shared/data-access';
import { nameIsNotEmpty, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The DTO sent from the frontend to the backend for updating an organization.
 * Suitable for use in PATCH requests.
 */
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
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug?: string;
}
