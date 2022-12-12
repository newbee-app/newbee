import { BaseEmailDto } from '@newbee/shared/data-access';
import { IsEmail } from 'class-validator';

/**
 * A verifiable DTO for sending an email value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class EmailDto implements BaseEmailDto {
  /**
   * @inheritdoc
   */
  @IsEmail()
  email!: string;
}
