import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import type {
  Authenticator,
  Doc,
  Organization,
  Post,
  Qna,
  Team,
  User,
  UserChallenge,
  UserSettings,
} from '../interface';

/**
 * For internal use in creating a user challenge.
 */
const testChallenge1 = 'challenge1';

/**
 * For internal use whenever we're working with datetimes.
 */
const now = new Date();

/**
 * An example instance of Authenticator.
 * Strictly for use in testing.
 */
export const testAuthenticator1: Authenticator = {
  credentialId: 'Y3JlZDE', // 'cred1' with base64url encoding
  credentialPublicKey: 'Y3JlZHBrMQ', // 'credpk1' with base64url encoding
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
  slug: 'newbee',
};

/**
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam1: Team = {
  name: 'Development',
  slug: 'development',
};

/**
 * An example instance of Post.
 * Strictly for use in testing.
 */
export const testPost1: Post = {
  createdAt: now,
  updatedAt: now,
  markedUpToDateAt: now,
  upToDate: true,
  title: 'Title',
  slug: 'slug',
};

/**
 * An example instance of Doc.
 * Strictly for use in testing.
 */
export const testDoc1: Doc = {
  ...testPost1,
  rawMarkdown: 'rawmarkdown',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedHtml: 'renderedhtml',
};

/**
 * An example instance of Qna.
 * Strictly for use in testing.
 */
export const testQna1: Qna = {
  ...testPost1,
  questionMarkdown: 'questionmarkdown',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedQuestion: 'renderedquestion',
  answerMarkdown: 'answermarkdown',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedAnswer: 'renderedanswer',
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
 * An example instance of RegistrationResponseJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testRegistrationResponse1: RegistrationResponseJSON = {
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
 * An example instance of AuthenticationResponseJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testAuthenticationCredential1: AuthenticationResponseJSON = {
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
