import { BaseGenerateSlugDto } from '@newbee/shared/data-access';
import { baseIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to generate a slug based on a given base string.
 * Suitable for use in any request.
 */
export class GenerateSlugDto implements BaseGenerateSlugDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: baseIsNotEmpty })
  base!: string;
}
