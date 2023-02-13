import { BaseCreateDocDto } from '@newbee/shared/data-access';
import { docIsNotEmpty, titleIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backed to create a new doc.
 * Suitable for use in POST requests.
 */
export class CreateDocDto implements BaseCreateDocDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: titleIsNotEmpty })
  title!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: docIsNotEmpty })
  rawMarkdown!: string;
}
