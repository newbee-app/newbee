import { BaseSuggestDto } from '@newbee/shared/data-access';
import {
  queryIsNotEmpty,
  SolrEntryEnum,
  typeIsEnum,
} from '@newbee/shared/util';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent front the frontend to the backend to execute a query suggestion.
 * Suitable for use in POST requests.
 */
export class SuggestDto implements BaseSuggestDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: queryIsNotEmpty })
  query!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrEntryEnum, { message: typeIsEnum })
  type?: SolrEntryEnum;
}
