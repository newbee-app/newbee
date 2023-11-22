import { BaseTokenDto, tokenIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to send a token.
 * Suitable for use in any request.
 */
export class TokenDto implements BaseTokenDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: tokenIsNotEmpty })
  token!: string;
}
