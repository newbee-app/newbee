import { BaseNameDto, nameIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to pass a name value.
 * Suitable for use in any request.
 */
export class NameDto implements BaseNameDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  name!: string | null;
}
