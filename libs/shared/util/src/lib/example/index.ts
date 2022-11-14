import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';
import { Authenticator, User, UserChallenge, UserSettings } from '../interface';

export const testAuthenticator1: Authenticator = {
  id: '1',
  credentialId: 'cred1',
  credentialPublicKey: Buffer.from('credpk1', 'utf-8'),
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
};

export const testUserChallenge1: UserChallenge = {
  userId: '1',
  challenge: 'challenge1',
};

export const testUserSettings1: UserSettings = {
  userId: '1',
};

export const testUser1: User = {
  id: '1',
  email: 'johndoe@example.com',
  name: 'John Doe',
  displayName: 'John',
  active: true,
  online: false,
};

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

export const testPublicKeyCredentialRequestOptions1: PublicKeyCredentialRequestOptionsJSON =
  {
    challenge: 'challenge1',
  };

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
