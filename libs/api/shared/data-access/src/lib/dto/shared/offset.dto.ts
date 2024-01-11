import { BaseOffsetDto, offsetIsInt, offsetMin0 } from '@newbee/shared/util';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend containing an offset value.
 * Suitable for use in GET requests.
 */
export class OffsetDto implements BaseOffsetDto {
  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  offset = 0;
}
