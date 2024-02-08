import { IsNotEmpty } from 'class-validator';
import { baseIsNotEmpty } from '../../constant';

/**
 * The DTO sent from the frontend to the backend to generate a slug based on a given base string.
 */
export class GenerateSlugDto {
  /**
   * What to base the slug on.
   */
  @IsNotEmpty({ message: baseIsNotEmpty })
  readonly base: string;

  constructor(base: string) {
    this.base = base;
  }
}
