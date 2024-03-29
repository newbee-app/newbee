import { EmailDto } from '@newbee/api/shared/data-access';
import { BaseWebAuthnLoginDto, responseIsDefined } from '@newbee/shared/util';
import type { AuthenticationResponseJSON } from '@simplewebauthn/typescript-types';
import { IsDefined } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to submit the authenticator's response after feeding the backend's authentication options to it.
 * Suitable for use with POST requests.
 */
export class WebAuthnLoginDto extends EmailDto implements BaseWebAuthnLoginDto {
  /**
   * @inheritdoc
   */
  @IsDefined({ message: responseIsDefined })
  response!: AuthenticationResponseJSON;
}
