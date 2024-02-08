/**
 * The DTO sent from the backend to the frontend to indicate whether a checked slug has been taken.
 */
export class SlugTakenDto {
  /**
   * @param slugTaken Whether the checked slug was taken.
   */
  constructor(readonly slugTaken: boolean) {}
}
