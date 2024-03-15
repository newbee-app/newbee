import {
  AdminControlsEntity,
  AuthenticatorEntity,
  DocEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
  UserInvitesEntity,
  WaitlistMemberEntity,
} from '../entity';

/**
 * All of the actions for use with `oriz`.
 */
export type OrizAction = 'create' | 'read' | 'update' | 'delete' | 'all';

/**
 * All of the subjects for use with `oriz`.
 */
export type OrizSubject =
  | AdminControlsEntity
  | AuthenticatorEntity
  | DocEntity
  | OrgMemberEntity
  | OrgMemberInviteEntity
  | OrganizationEntity
  | QnaEntity
  | TeamMemberEntity
  | TeamEntity
  | UserEntity
  | UserInvitesEntity
  | WaitlistMemberEntity;
