import { BaseCheckSlugDto } from '@newbee/shared/data-access';
import { slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to check whether a slug is taken.
 * Suitable for use in any request.
 */
export class CheckSlugDto implements BaseCheckSlugDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;
}
