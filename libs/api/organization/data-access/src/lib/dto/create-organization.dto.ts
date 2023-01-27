import { BaseCreateOrganizationDto } from '@newbee/shared/data-access';
import { displayNameIsNotEmpty, nameIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  displayName: string | null = null;
}
