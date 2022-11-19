import { LoginForm, RegisterForm } from '@newbee/newbee/auth/util';
import type { HttpClientError } from '@newbee/newbee/shared/util';
import {
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUserCreatedDto,
} from '@newbee/shared/data-access';
import { createActionGroup, props } from '@ngrx/store';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'HTTP Client Error': props<{ httpClientError: HttpClientError }>(),
    'Send Login Magic Link': props<{ loginForm: LoginForm }>(),
    'Send Login Magic Link Success': props<{
      magicLinkLoginDto: BaseMagicLinkLoginDto;
    }>(),
    'Get WebAuthn Register Challenge': props<{ registerForm: RegisterForm }>(),
    'Get WebAuthn Register Challenge Success': props<{
      userCreatedDto: BaseUserCreatedDto;
    }>(),
    'Get WebAuthn Login Challenge': props<{ loginForm: LoginForm }>(),
    'Verify WebAuthn Login': props<{
      loginForm: LoginForm;
      options: PublicKeyCredentialRequestOptionsJSON;
    }>(),
    'Login Success': props<{ loginDto: BaseLoginDto }>(),
  },
});
