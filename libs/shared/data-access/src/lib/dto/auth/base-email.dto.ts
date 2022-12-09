/**
 * A DTO for sending an email value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class BaseEmailDto {
  /**
   * The email to be transported.
   */
  email!: string;
}
