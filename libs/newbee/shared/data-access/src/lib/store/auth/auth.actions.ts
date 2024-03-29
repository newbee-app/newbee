import {
  BaseCreateUserDto,
  BaseEmailDto,
  BaseMagicLinkLoginDto,
  BaseUserRelationAndOptionsDto,
  Keyword,
  UserRelation,
} from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * All actions tied to `AuthState`.
 */
export const AuthActions = createActionGroup({
  source: Keyword.Auth,
  events: {
    /**
     * Send a magic link login request to the API.
     * Should call `Send Login Magic Link Success` with the result and redirect.
     */
    'Send Login Magic Link': props<{ emailDto: BaseEmailDto }>(),

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
    'Register With WebAuthn': props<{ createUserDto: BaseCreateUserDto }>(),

    /**
     * Saves the newly created user and access token in the app-wide reducer, calls `[Authenticator] Create Authenticator`, and redirects.
     */
    'Register With WebAuthn Success': props<{
      userRelationAndOptionsDto: BaseUserRelationAndOptionsDto;
    }>(),

    /**
     * Gets WebAuthn login options from the API for logging in an existing user.
     * Should call `Login With WebAuthn` with the result, if successful.
     */
    'Create WebAuthn Login Options': props<{ emailDto: BaseEmailDto }>(),

    /**
     * Sends the authenticator's response back to the API for verification.
     * Should call `Login Success` with the result and redirect.
     */
    'Login With WebAuthn': props<{
      emailDto: BaseEmailDto;
      options: PublicKeyCredentialRequestOptionsJSON;
    }>(),

    /**
     * Indicates that login has been completed successfully.
     * Should save user data to the store.
     */
    'Login Success': props<{ userRelation: UserRelation }>(),

    /**
     * Initiate a logout request.
     */
    Logout: emptyProps(),

    /**
     * Indicates that the logout request has been completed successfully.
     * Should erase all user-specific data from the store.
     */
    'Logout Success': emptyProps(),
  },
});
