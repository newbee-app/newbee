export { magicLinkLogin } from '@newbee/shared/util';

// AUTH endpoints
/**
 * The URL endpoint associated with authentication and authorization.
 */
export const auth = 'auth';

/**
 * The URL endpoint associated with WebAuthn authentication.
 */
export const webauthn = 'webauthn';

/**
 * The URL endpoint for logging in.
 */
export const login = 'login';

/**
 * The URL endpoint for registering.
 */
export const register = 'register';

// AUTHENTICATOR endpoints
/**
 * The URL endpoint assocaited with Authenticator.
 */
export const authenticator = 'authenticator';

/**
 * The URL endpoint for creationg credential options.
 */
export const options = 'options';

// CSRF endpoints
/**
 * The URL endpoint associated with generating and receiving a CSRF token.
 */
export const csrf = 'csrf';

// USER endpoints
/**
 * The URL endpoint associated with User.
 */
export const user = 'user';

// ORGANIZATION endpoints
/**
 * The URL endpoint associated with Organization.
 */
export const organization = 'org';

// TEAM endpoints
/**
 * The URL endpoint associated with Team.
 */
export const team = 'team';

// DOC endpoints
/**
 * The URL endpoint associated with Doc.
 */
export const doc = 'doc';

// QNA endpoints
/**
 * The URL endpoint associated with Qna.
 */
export const qna = 'qna';

/**
 * The URL endpoint associated with the question portion of a Qna.
 */
export const question = 'question';

/**
 * The URL endpoint associated with the answer portion of a Qna.
 */
export const answer = 'answer';
