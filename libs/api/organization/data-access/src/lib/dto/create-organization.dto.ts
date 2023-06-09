import { BaseCreateOrganizationDto } from '@newbee/shared/data-access';
import { nameIsNotEmpty, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
export class CreateOrganizationDto implements BaseCreateOrganizationDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  name!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;
}
