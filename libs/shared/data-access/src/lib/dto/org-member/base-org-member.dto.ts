import type { Doc, OrgMember, Qna, User } from '@newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';
import { BaseTeamMemberDto } from '../team-member';

/**
 * The DTO sent from the backend to the frontend to show information about an org member.
 */
export class BaseOrgMemberDto implements OrgMember, User {
  /**
   * @inheritdoc
   */
  role!: OrgRoleEnum;

  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  email!: string;

  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  displayName!: string | null;

  /**
   * @inheritdoc
   */
  phoneNumber!: string | null;

  /**
   * @inheritdoc
   */
  active!: boolean;

  /**
   * The teams the org member is a part of, and the role they hold in each team.
   */
  teams!: BaseTeamMemberDto[];

  /**
   * Some of the docs the org member created.
   */
  createdDocs!: Doc[];

  /**
   * Some of the docs the org member maintains.
   */
  maintainedDocs!: Doc[];

  /**
   * Some of the qnas the org member created.
   */
  createdQnas!: Qna[];

  /**
   * Some of the qnas the org member maintains.
   */
  maintainedQnas!: Qna[];
}
