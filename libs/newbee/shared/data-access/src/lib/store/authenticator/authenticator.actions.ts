import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * Actions for use in creating authenticator-related effects.
 */
export const AuthenticatorActions = createActionGroup({
  source: 'Authenticator',
  events: {
    /**
     * Gets a register challenge from the API for registering a new authenticator for an existing user.
     * Should call `Verify Register Challenge` with the result.
     */
    'Get Register Challenge': emptyProps(),

    /**
     * Sends the authenticator's response back to the API for registration.
     * Should call `Verify Register Challenge Success`, if successful.
     */
    'Verify Register Challenge': props<{
      options: PublicKeyCredentialCreationOptionsJSON;
    }>(),

    /**
     * Marks the authenticator registraiton as successful.
     */
    'Verify Register Challenge Success': emptyProps(),
  },
});
