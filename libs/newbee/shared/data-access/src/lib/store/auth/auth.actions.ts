import { LoginForm, RegisterForm } from '@newbee/newbee/auth/util';
import {
  BaseMagicLinkLoginDto,
  BaseUserAndOptionsDto,
} from '@newbee/shared/data-access';
import { User } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * All actions tied to `AuthState`.
 */
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    /**
     * Send a magic link login request to the API.
     * Should call `Send Login Magic Link Success` with the result and redirect.
     */
    'Send Login Magic Link': props<{ loginForm: LoginForm }>(),

    /**
     * Marks the magic link as successfully sent to the user's email.
     * The information is saved in the module-specific reducer for display to the user.
     */
    'Send Login Magic Link Success': props<{
      magicLinkLoginDto: BaseMagicLinkLoginDto;
    }>(),

    /**
     * Send a magic link login confirmation request to the API.
     * Should call `Login Success` with the result and redirect.
     */
    'Confirm Magic Link': props<{ token: string }>(),

    /**
     * Register a new user and get WebAuthn registration options from the API for registering a new authenticator.
     * Should call `Register With WebAuthn Success` with the result, if successful.
     */
    'Register With WebAuthn': props<{ registerForm: RegisterForm }>(),

    /**
     * Saves the newly created user and access token in the app-wide reducer, calls `[Authenticator] Create Authenticator`, and redirects.
     */
    'Register With WebAuthn Success': props<{
      userAndOptionsDto: BaseUserAndOptionsDto;
    }>(),

    /**
     * Gets WebAuthn login options from the API for logging in an existing user.
     * Should call `Login With WebAuthn` with the result, if successful.
     */
    'Create WebAuthn Login Options': props<{ loginForm: LoginForm }>(),

    /**
     * Sends the authenticator's response back to the API for verification.
     * Should call `Login Success` with the result and redirect.
     */
    'Login With WebAuthn': props<{
      loginForm: LoginForm;
      options: PublicKeyCredentialRequestOptionsJSON;
    }>(),

    /**
     * Indicates that login has been completed successfully.
     * Should save user data to the store.
     */
    'Login Success': props<{ user: User }>(),
  },
});
