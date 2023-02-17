import { BaseRegistrationResponseDto } from '@newbee/shared/data-access';
import { responseIsDefined } from '@newbee/shared/util';
import type { RegistrationResponseJSON } from '@simplewebauthn/typescript-types';
import { IsDefined } from 'class-validator';

export class RegistrationResponseDto implements BaseRegistrationResponseDto {
  /**
   * @inheritdoc
   */
  @IsDefined({ message: responseIsDefined })
  response!: RegistrationResponseJSON;
}
