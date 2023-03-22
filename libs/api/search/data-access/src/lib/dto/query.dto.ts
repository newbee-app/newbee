import { BaseQueryDto } from '@newbee/shared/data-access';
import { offsetIsInt, offsetMin0, queryIsNotEmpty } from '@newbee/shared/util';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class QueryDto implements BaseQueryDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: queryIsNotEmpty })
  query!: string;

  /**
   * @inheritdoc
   */
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  offset = 0;
}
