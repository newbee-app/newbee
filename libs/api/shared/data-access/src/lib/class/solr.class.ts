import { SolrDocFields } from '@newbee/api/shared/util';
import { SolrEntryEnum } from '@newbee/shared/util';
import { AddDocParams, DocInput } from '@newbee/solr-cli';
import { DocEntity, OrgMemberEntity, QnaEntity, TeamEntity } from '../entity';

/**
 * A class compatible with a doc Solr doc.
 * Made to add a new doc to Solr.
 */
export class DocDocParams extends SolrDocFields implements AddDocParams {
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
    super(id, SolrEntryEnum.Doc, slug, createdAt, updatedAt, {
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
 * A class compatible with a qna Solr doc.
 * Made to add a new qna to Solr.
 */
export class QnaDocParams extends SolrDocFields implements AddDocParams {
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
    super(id, SolrEntryEnum.Qna, slug, createdAt, updatedAt, {
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
 * A class compatible with a team Solr doc.
 * Made to add a new team to Solr.
 */
export class TeamDocParams extends SolrDocFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(team: TeamEntity) {
    const { id, slug, createdAt, updatedAt, name } = team;
    super(id, SolrEntryEnum.Team, slug, createdAt, updatedAt, {
      team_name: name,
    });
  }
}

/**
 * A class compatible with an org member Solr doc.
 * Made to add a new org member to Solr.
 *
 * NOTE the constructor assumes the org member's `user` field is populated.
 */
export class OrgMemberDocParams extends SolrDocFields implements AddDocParams {
  /**
   * Needed to implement `AddDocParams`.
   */
  [docFields: string]: DocInput;

  constructor(orgMember: OrgMemberEntity) {
    const { id, slug, createdAt, updatedAt, user, role } = orgMember;
    const { email, name, displayName, phoneNumber } = user;
    super(id, SolrEntryEnum.User, slug, createdAt, updatedAt, {
      user_org_role: role,
      user_email: email,
      user_name: name,
      user_display_name: displayName,
      user_phone_number: phoneNumber,
    });
  }
}
