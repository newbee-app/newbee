import { BaseQueryDto } from '@newbee/shared/data-access';
import {
  offsetIsInt,
  offsetMin0,
  SolrEntryEnum,
  typeIsEnum,
} from '@newbee/shared/util';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SuggestDto } from './suggest.dto';

/**
 * The verifiable DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class QueryDto extends SuggestDto implements BaseQueryDto {
  /**
   * @inheritdoc
   */
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  offset = 0;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrEntryEnum, { message: typeIsEnum })
  type: SolrEntryEnum | null = null;
}
