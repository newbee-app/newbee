import { BaseWebAuthnLoginDto } from '@newbee/shared/data-access';
import type { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types';
import { IsDefined } from 'class-validator';
import { EmailDto } from './email.dto';

export class WebAuthnLoginDto extends EmailDto implements BaseWebAuthnLoginDto {
  @IsDefined()
  credential!: AuthenticationCredentialJSON;
}
