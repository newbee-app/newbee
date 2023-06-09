/**
 * The DTO sent from the frontend to the backend to check whether a slug is taken.
 */
export class BaseCheckSlugDto {
  /**
   * The slug to check.
   */
  slug!: string;
}
