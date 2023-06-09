/**
 * An enum containing all of the URL endpoints used in NewBee, for the sake of standardization and avoiding typos.
 */
export enum UrlEndpoint {
  // auth endpoints
  Auth = 'auth',
  Webauthn = 'webauthn',
  Login = 'login',
  Register = 'register',
  Logout = 'logout',
  ConfirmEmail = 'confirm-email',

  // authenticator endpoints
  Authenticator = 'authenticator',
  Options = 'options',

  // cookie options
  Cookie = 'cookie',

  // user endpoints
  User = 'user',

  // organization endpoints
  Organization = 'org',

  // team endpoints
  Team = 'team',

  // doc endpoints
  Doc = 'doc',

  // qna endpoints
  Qna = 'qna',
  Question = 'question',
  Answer = 'answer',

  // org member endpoints
  OrgMember = 'member',

  // search endpoints
  Search = 'search',
  Suggest = 'suggest',

  // org member invite endpoints
  Invite = 'invite',
  Accept = 'accept',
  Decline = 'decline',

  // general endpoints
  Api = 'api',
  New = 'new',
  Edit = 'edit',
  CheckSlug = 'check-slug',
  GenerateSlug = 'generate-slug',
}
