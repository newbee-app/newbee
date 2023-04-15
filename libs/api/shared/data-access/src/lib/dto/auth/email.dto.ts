import { BaseEmailDto } from '@newbee/shared/data-access';
import { emailIsEmail } from '@newbee/shared/util';
import { IsEmail } from 'class-validator';

/**
 * The verifiable DTO for sending an email value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class EmailDto implements BaseEmailDto {
  /**
   * @inheritdoc
   */
  @IsEmail(undefined, {
    message: emailIsEmail,
  })
  email!: string;
}
