/**
 * An enum containing all of the important reused keywords in NewBee, for the sake of standardization and avoiding typos.
 * For use in URL endpoints, components, services, display, etc.
 * For use in the backend and the frontend.
 */
export enum Keyword {
  // admin controls keywords
  Admin = 'admin',

  // auth keywords
  Auth = 'auth',
  WebAuthn = 'webauthn',
  Login = 'login',
  Register = 'register',
  Logout = 'logout',
  ConfirmEmail = 'confirm-email',
  MagicLinkLogin = 'magic-link-login',

  // authenticator keywords
  Authenticator = 'authenticator',
  Options = 'options',

  // cookie keywords
  Cookie = 'cookie',

  // user keywords
  User = 'user',
  Verify = 'verify',

  // organization keywords
  Organization = 'org',

  // team keywords
  Team = 'team',

  // doc keywords
  Doc = 'doc',

  // qna keywords
  Qna = 'qna',
  Question = 'question',
  Answer = 'answer',

  // member keywords
  Member = 'member',
  OrgMember = 'org-member',
  TeamMember = 'team-member',
  Role = 'role',

  // search keywords
  Search = 'search',
  Suggest = 'suggest',
  Type = 'type',
  Creator = 'creator',
  Maintainer = 'maintainer',

  // org member invite keywords
  OrgMemberInvite = 'org-member-invite',
  Invite = 'invite',
  Accept = 'accept',
  Decline = 'decline',

  // slug keywords
  CheckSlug = 'check-slug',
  GenerateSlug = 'generate-slug',

  // general keywords
  Api = 'api',
  New = 'new',
  Edit = 'edit',
  Delete = 'delete',
  Success = 'success',

  // misc stuff for use in ngrx stores
  Http = 'http',
  Toast = 'toast',
  Misc = 'misc',
  Router = 'router',
  Slug = 'slug',
}
