/**
 * The DTO sent from the frontend to the backend to generate a slug based on a given base string.
 */
export class BaseGenerateSlugDto {
  /**
   * What to base the slug on.
   */
  base!: string;
}
