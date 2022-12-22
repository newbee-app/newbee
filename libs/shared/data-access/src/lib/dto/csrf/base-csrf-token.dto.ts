/**
 * A DTO for sending a CSRF token from the backend to the frontend.
 */
export interface BaseCsrfTokenDto {
  /**
   * The CSRF token tied to the DTO.
   */
  csrfToken: string;
}
