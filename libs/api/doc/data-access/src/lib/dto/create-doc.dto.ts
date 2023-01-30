import { BaseCreateDocDto } from '@newbee/shared/data-access';
import { docIsNotEmpty, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backed to create a new doc.
 * Suitable for use in POST requests.
 */
export class CreateDocDto implements BaseCreateDocDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: docIsNotEmpty })
  rawMarkdown!: string;
}
