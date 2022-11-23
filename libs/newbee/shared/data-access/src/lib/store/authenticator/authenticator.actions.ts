import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

export const AuthenticatorActions = createActionGroup({
  source: 'Authenticator',
  events: {
    'Get Register Challenge': emptyProps(),
    'Verify Register Challenge': props<{
      options: PublicKeyCredentialCreationOptionsJSON;
    }>(),
    'Verify Register Challenge Success': emptyProps(),
  },
});
