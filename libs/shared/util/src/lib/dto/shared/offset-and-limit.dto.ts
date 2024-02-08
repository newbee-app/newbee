import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { limitIsInt, limitMin1, offsetIsInt, offsetMin0 } from '../../constant';
import { OffsetAndLimit } from '../../interface';

/**
 * The verifiable DTO sent from the frontend to the backend containing an offset and limit value.
 * Suitable for use in GET requests.
 */
export class OffsetAndLimitDto implements OffsetAndLimit {
  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  readonly offset: number;

  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: limitIsInt })
  @Min(1, { message: limitMin1 })
  readonly limit: number;

  constructor(offset: number, limit: number) {
    this.offset = offset;
    this.limit = limit;
  }
}
