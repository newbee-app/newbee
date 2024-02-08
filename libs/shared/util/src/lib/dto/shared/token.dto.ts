import { IsNotEmpty } from 'class-validator';
import { tokenIsNotEmpty } from '../../constant';

/**
 * The DTO sent from the frontend to the backend to send a token.
 * Suitable for use in any request.
 */
export class TokenDto {
  /**
   * The token to send.
   */
  @IsNotEmpty({ message: tokenIsNotEmpty })
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
