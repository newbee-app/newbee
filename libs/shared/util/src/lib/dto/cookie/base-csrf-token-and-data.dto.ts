import { UserRelation } from '../../interface';

/**
 * A DTO for sending a CSRF token from the backend to the frontend.
 */
export interface BaseCsrfTokenAndDataDto {
  /**
   * The CSRF token tied to the DTO.
   */
  csrfToken: string;

  /**
   * Information about the logged in user, if applicable.
   */
  userRelation: UserRelation | null;
}
