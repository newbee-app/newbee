import { BaseWebAuthnLoginDto } from '@newbee/shared/data-access';
import type { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types';
import { IsDefined } from 'class-validator';
import { EmailDto } from './email.dto';

/**
 * The verifiable DTO sent from the frontend to the backend to submit the authenticator's response after feeding the backend's authentication options to it.
 * Suitable for use with POST requests.
 */
export class WebAuthnLoginDto extends EmailDto implements BaseWebAuthnLoginDto {
  /**
   * @inheritdoc
   */
  @IsDefined()
  credential!: AuthenticationCredentialJSON;
}
