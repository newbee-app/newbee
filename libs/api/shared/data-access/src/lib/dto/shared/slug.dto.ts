import { BaseSlugDto, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to pass a slug value.
 * Suitable for use in any request.
 */
export class SlugDto implements BaseSlugDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;
}
