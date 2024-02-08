import { UserRelation } from '../../interface';

/**
 * A DTO for sending a CSRF token from the backend to the frontend.
 */
export class CsrfTokenAndDataDto {
  /**
   * @param csrfToken The CSRF token tied to the DTO.
   * @param userRelation Information about the logged in user, if applicable.
   */
  constructor(
    readonly csrfToken: string,
    readonly userRelation: UserRelation | null = null,
  ) {}
}
