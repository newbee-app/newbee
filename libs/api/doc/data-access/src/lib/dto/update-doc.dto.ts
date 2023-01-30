import { BaseUpdateDocDto } from '@newbee/shared/data-access';
import { docIsNotEmpty, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update a Doc.
 * Suitable for use in PATCH requests.
 */
export class UpdateDocDto implements BaseUpdateDocDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: docIsNotEmpty })
  rawMarkdown?: string;
}