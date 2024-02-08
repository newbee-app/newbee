import type { RegistrationResponseJSON } from '@simplewebauthn/typescript-types';
import { IsDefined } from 'class-validator';
import { responseIsDefined } from '../../constant';

/**
 * A DTO for sending a registration response from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class RegistrationResponseDto {
  /**
   * The public key credential creation options to be transported.
   */
  @IsDefined({ message: responseIsDefined })
  readonly response: RegistrationResponseJSON;

  constructor(response: RegistrationResponseJSON) {
    this.response = response;
  }
}
