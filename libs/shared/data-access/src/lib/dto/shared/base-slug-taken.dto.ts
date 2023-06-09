/**
 * The DTO sent from the backend to the frontend to indicate whether a checked slug has been taken.
 */
export class BaseSlugTakenDto {
  /**
   * Whether the checked slug was taken.
   */
  slugTaken!: boolean;
}
