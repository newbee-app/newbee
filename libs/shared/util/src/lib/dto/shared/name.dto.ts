import { IsNotEmpty, IsOptional } from 'class-validator';
import { nameIsNotEmpty } from '../../constant';

/**
 * The DTO sent from the frontend to the backend to send a name.
 * Suitable for use in non-GET requests.
 */
export class NameDto {
  /**
   * The name to send.
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name: string | null;

  constructor(name: string | null) {
    this.name = name;
  }
}
