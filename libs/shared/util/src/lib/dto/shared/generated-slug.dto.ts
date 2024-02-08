/**
 * The DTO sent from the backend to the frontend containing the slug auto-generated from a base string.
 */
export class GeneratedSlugDto {
  /**
   * @param generatedSlug The auto-generated slug.
   */
  constructor(readonly generatedSlug: string) {}
}
