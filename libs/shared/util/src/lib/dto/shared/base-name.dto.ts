/**
 * The DTO sent from the frontend to the backend to send a name.
 * Suitable for use in any request.
 */
export class BaseNameDto {
  /**
   * The name to send.
   */
  name!: string | null;
}
