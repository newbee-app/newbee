import {
  BaseQueryDto,
  offsetIsInt,
  offsetMin0,
  SolrEntryEnum,
  typeIsEnum,
} from '@newbee/shared/util';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SuggestDto } from './suggest.dto';

/**
 * The verifiable DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in GET requests.
 */
export class QueryDto extends SuggestDto implements BaseQueryDto {
  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  offset = 0;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsEnum(SolrEntryEnum, { message: typeIsEnum })
  type?: SolrEntryEnum;
}
