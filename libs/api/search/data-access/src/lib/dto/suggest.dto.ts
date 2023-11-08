import { BaseSuggestDto, queryIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent front the frontend to the backend to execute a query suggestion.
 * Suitable for use in GET requests.
 */
export class SuggestDto implements BaseSuggestDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: queryIsNotEmpty })
  query!: string;
}
