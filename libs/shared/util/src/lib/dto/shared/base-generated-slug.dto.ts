/**
 * The DTO sent from the backend to the frontend containing the slug auto-generated from a base string.
 */
export class BaseGeneratedSlugDto {
  /**
   * The auto-generated slug.
   */
  generatedSlug!: string;
}
