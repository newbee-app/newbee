import { SolrAppFields, SolrOrgFields } from '@newbee/api/shared/util';
import { SolrAppEntryEnum, SolrOrgEntryEnum } from '@newbee/shared/util';
import { AddDocParams, DocInput } from '@newbee/solr-cli';
import {
  DocEntity,
  OrgMemberEntity,
  QnaEntity,
  TeamEntity,
  UserEntity,
  WaitlistMemberEntity,
} from '../entity';

/**
 * A class compatible with a doc Solr org doc.
 * Made to add a new doc to Solr.
 */
export class DocDocParams extends SolrOrgFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(doc: DocEntity) {
    const {
      id,
      slug,
      team,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      creator,
      maintainer,
      title,
      docTxt,
    } = doc;
    super(id, SolrOrgEntryEnum.Doc, slug, createdAt, updatedAt, {
      team_id: team?.id ?? null,
      marked_up_to_date_at: markedUpToDateAt,
      out_of_date_at: outOfDateAt,
      creator_id: creator?.id ?? null,
      maintainer_id: maintainer?.id ?? null,
      doc_title: title,
      doc_txt: docTxt,
    });
  }
}

/**
 * A class compatible with a qna Solr org doc.
 * Made to add a new qna to Solr.
 */
export class QnaDocParams extends SolrOrgFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(qna: QnaEntity) {
    const {
      id,
      slug,
      team,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      creator,
      maintainer,
      title,
      questionTxt,
      answerTxt,
    } = qna;
    super(id, SolrOrgEntryEnum.Qna, slug, createdAt, updatedAt, {
      team_id: team?.id ?? null,
      marked_up_to_date_at: markedUpToDateAt,
      out_of_date_at: outOfDateAt,
      creator_id: creator?.id ?? null,
      maintainer_id: maintainer?.id ?? null,
      qna_title: title,
      question_txt: questionTxt,
      answer_txt: answerTxt,
    });
  }
}

/**
 * A class compatible with a team Solr org doc.
 * Made to add a new team to Solr.
 */
export class TeamDocParams extends SolrOrgFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(team: TeamEntity) {
    const { id, slug, createdAt, updatedAt, name } = team;
    super(id, SolrOrgEntryEnum.Team, slug, createdAt, updatedAt, {
      team_name: name,
    });
  }
}

/**
 * A class compatible with an org member Solr org doc.
 * Made to add a new org member to Solr.
 *
 * NOTE the constructor assumes the org member's `user` field is populated.
 */
export class OrgMemberDocParams extends SolrOrgFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(orgMember: OrgMemberEntity) {
    const { id, slug, createdAt, updatedAt, user, role } = orgMember;
    const { email, name, displayName, phoneNumber } = user;
    super(id, SolrOrgEntryEnum.User, slug, createdAt, updatedAt, {
      user_email: email,
      user_name: name,
      user_display_name: displayName,
      user_phone_number: phoneNumber,
      user_org_role: role,
    });
  }
}

/**
 * A class compatible with a user Solr app doc.
 * Made to add a new user to Solr.
 */
export class UserDocParams extends SolrAppFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(user: UserEntity) {
    const {
      id,
      createdAt,
      updatedAt,
      email,
      name,
      displayName,
      phoneNumber,
      role,
    } = user;
    super(id, SolrAppEntryEnum.User, createdAt, updatedAt, {
      user_email: email,
      user_name: name,
      user_display_name: displayName,
      user_phone_number: phoneNumber,
      user_app_role: role,
    });
  }
}

/**
 * A class compatible with a waitlist Solr app doc.
 * Made to add a new user to Solr.
 */
export class WaitlistDocParams extends SolrAppFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(waitlistMember: WaitlistMemberEntity) {
    const { id, createdAt, updatedAt, email, name } = waitlistMember;
    super(id, SolrAppEntryEnum.Waitlist, createdAt, updatedAt, {
      waitlist_email: email,
      waitlist_name: name,
    });
  }
}
