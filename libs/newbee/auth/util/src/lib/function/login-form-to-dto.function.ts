import { BaseEmailDto } from '@newbee/shared/data-access';
import type { LoginForm } from '../interface';

/**
 * Converts a LoginForm to a BaseEmailDto.
 *
 * @param loginForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function loginFormToDto(
  loginForm: LoginForm | Partial<LoginForm>
): BaseEmailDto {
  const { email } = loginForm;
  return { email: email ?? '' };
}
