import type { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types';
import { BaseEmailDto } from './base-email.dto';

export class BaseWebAuthnLoginDto extends BaseEmailDto {
  credential!: AuthenticationCredentialJSON;
}
