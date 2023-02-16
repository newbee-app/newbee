import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * Actions for use in creating authenticator-related effects.
 */
export const AuthenticatorActions = createActionGroup({
  source: 'Authenticator',
  events: {
    /**
     * Creates registration options from the API for registering a new authenticator for an existing user.
     * Should call `Create Authenticator` with the result.
     */
    'Create Registration Options': emptyProps(),

    /**
     * Sends the authenticator's response back to the API for registration.
     * Should call `Create Authenticator Success`, if successful.
     */
    'Create Authenticator': props<{
      options: PublicKeyCredentialCreationOptionsJSON;
    }>(),

    /**
     * Marks the authenticator registraiton as successful.
     */
    'Create Authenticator Success': emptyProps(),
  },
});
