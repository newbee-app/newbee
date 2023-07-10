/**
 * The DTO sent from the frontend to the backend to pass a slug value.
 * Suitable for use in any request.
 */
export class BaseSlugDto {
  /**
   * The slug to send.
   */
  slug!: string;
}
