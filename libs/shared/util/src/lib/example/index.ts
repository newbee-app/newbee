import type {
  AuthenticationCredentialJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';
import { Authenticator, User, UserChallenge, UserSettings } from '../interface';

/**
 * An example instance of Authenticator.
 * Strictly for use in testing.
 */
export const testAuthenticator1: Authenticator = {
  id: '1',
  credentialId: 'cred1',
  credentialPublicKey: 'credpk1',
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
  transports: null,
};

/**
 * An example instance of UserChallenge.
 * Strictly for use in testing.
 */
export const testUserChallenge1: UserChallenge = {
  id: '1',
  challenge: 'challenge1',
};

/**
 * An example instance of UserSettings.
 * Strictly for use in testing.
 */
export const testUserSettings1: UserSettings = {
  id: '1',
};

/**
 * An example instance of User.
 * Strictly for use in testing.
 */
export const testUser1: User = {
  id: '1',
  email: 'johndoe@example.com',
  name: 'John Doe',
  displayName: 'John',
  phoneNumber: null,
  active: true,
  online: false,
};

/**
 * An example instance of PublicKeyCredentialCreationOptionsJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testPublicKeyCredentialCreationOptions1: PublicKeyCredentialCreationOptionsJSON =
  {
    user: {
      id: testUser1.id,
      name: testUser1.email,
      displayName: testUser1.displayName ?? testUser1.name,
    },
    challenge: 'challenge1',
    excludeCredentials: [],
    rp: {
      name: 'rp1',
    },
    pubKeyCredParams: [],
  };

/**
 * An example instance of PublicKeyCredentialRequestOptionsJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testPublicKeyCredentialRequestOptions1: PublicKeyCredentialRequestOptionsJSON =
  {
    challenge: 'challenge1',
  };

/**
 * An example instance of RegistrationCredentialJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testRegistrationCredential1: RegistrationCredentialJSON = {
  rawId: 'rawId1',
  id: testAuthenticator1.id,
  type: 'public-key',
  clientExtensionResults: {},
  response: {
    clientDataJSON: 'clientData1',
    attestationObject: 'attestation1',
  },
};

/**
 * An example instance of AuthenticationCredentialJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testAuthenticationCredential1: AuthenticationCredentialJSON = {
  rawId: 'rawId1',
  id: testAuthenticator1.id,
  type: 'public-key',
  clientExtensionResults: {},
  response: {
    authenticatorData: 'authenticatorData1',
    clientDataJSON: 'clientData1',
    signature: 'signature1',
  },
};
