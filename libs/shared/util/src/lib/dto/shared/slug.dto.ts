import { IsNotEmpty } from 'class-validator';
import { slugIsNotEmpty } from '../../constant';

/**
 * The DTO sent from the frontend to the backend to pass a slug value.
 * Suitable for use in any request.
 */
export class SlugDto {
  /**
   * The slug to send.
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  readonly slug: string;

  constructor(slug: string) {
    this.slug = slug;
  }
}
