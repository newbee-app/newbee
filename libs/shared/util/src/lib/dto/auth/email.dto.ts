import { IsEmail } from 'class-validator';
import { emailIsEmail } from '../../constant';

/**
 * A DTO for sending an email value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class EmailDto {
  /**
   * The email to be transported.
   */
  @IsEmail(undefined, { message: emailIsEmail })
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}
