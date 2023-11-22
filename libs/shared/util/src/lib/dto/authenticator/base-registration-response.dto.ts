import type { RegistrationResponseJSON } from '@simplewebauthn/typescript-types';

/**
 * A DTO for sending a registration response from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class BaseRegistrationResponseDto {
  /**
   * The public key credential creation options to be transported.
   */
  response!: RegistrationResponseJSON;
}
