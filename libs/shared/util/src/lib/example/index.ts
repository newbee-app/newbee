import type {
  AuthenticationCredentialJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';
import type {
  Authenticator,
  Organization,
  User,
  UserChallenge,
  UserSettings,
} from '../interface';

/**
 * An example instance of Authenticator.
 * Strictly for use in testing.
 */
export const testAuthenticator1: Authenticator = {
  credentialId: Buffer.from('cred1').toString('base64url'),
  credentialPublicKey: Buffer.from('credpk1').toString('base64url'),
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
  transports: null,
};

const testChallenge1 = 'challenge1';
/**
 * An example instance of UserChallenge.
 * Strictly for use in testing.
 */
export const testUserChallenge1: UserChallenge = {
  id: '1',
  challenge: testChallenge1,
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
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization1: Organization = {
  name: 'NewBee',
  displayName: null,
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
    challenge: testChallenge1,
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
    challenge: testChallenge1,
  };

/**
 * An example instance of RegistrationCredentialJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testRegistrationCredential1: RegistrationCredentialJSON = {
  rawId: 'rawId1',
  id: testAuthenticator1.credentialId,
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
  id: testAuthenticator1.credentialId,
  type: 'public-key',
  clientExtensionResults: {},
  response: {
    authenticatorData: 'authenticatorData1',
    clientDataJSON: 'clientData1',
    signature: 'signature1',
  },
};
