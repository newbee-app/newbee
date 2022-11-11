import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { BaseLoginDto } from './base-login.dto';

export class BaseUserCreatedDto extends BaseLoginDto {
  options!: PublicKeyCredentialCreationOptionsJSON;
}
