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
     * Get a WebAuthn register challenge from the API for registering a new user.
     * Should call `Get WebAuthn Register Challenge Success` with the result, if successful.
     */
    'Post WebAuthn Register Challenge': props<{ registerForm: RegisterForm }>(),

    /**
     * Saves the newly created user and access token in the app-wide reducer, calls `[Authenticator] Verify Register Challenge`, and redirects.
     */
    'Post WebAuthn Register Challenge Success': props<{
      userAndOptionsDto: BaseUserAndOptionsDto;
    }>(),

    /**
     * Gets a WebAuthn login challenge from the API for logging in an existing user.
     * Should call `Verify WebAuthn Login Challenge` with the result, if successful.
     */
    'Get WebAuthn Login Challenge': props<{ loginForm: LoginForm }>(),

    /**
     * Sends the authenticator's response back to the API for verification.
     * Should call `Login Success` with the result and redirect.
     */
    'Verify WebAuthn Login Challenge': props<{
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
