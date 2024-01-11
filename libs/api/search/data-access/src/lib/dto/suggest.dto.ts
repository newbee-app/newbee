import {
  BaseSuggestDto,
  SolrEntryEnum,
  queryIsNotEmpty,
  typeIsEnum,
} from '@newbee/shared/util';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

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

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrEntryEnum, { message: typeIsEnum })
  type?: SolrEntryEnum;
}
