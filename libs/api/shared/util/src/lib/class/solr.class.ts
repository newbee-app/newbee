import { OrgRoleEnum, SolrEntryEnum } from '@newbee/shared/util';
import type { AddDocParams, DocInput } from '@newbee/solr-cli';
import type { SolrDocFields } from '../interface';

export class OrgMemberDocParams implements SolrDocFields, AddDocParams {
  readonly entry_type = SolrEntryEnum.User;

  constructor(
    readonly id: string,
    readonly slug: string,
    readonly user_email: string,
    readonly user_name: string,
    readonly user_display_name: string | null,
    readonly user_phone_number: string | null,
    readonly role: OrgRoleEnum
  ) {}

  [docFields: string]: DocInput;
}

export class TeamDocParams implements SolrDocFields, AddDocParams {
  readonly entry_type = SolrEntryEnum.Team;

  constructor(
    readonly id: string,
    readonly slug: string,
    readonly team_name: string
  ) {}

  [docFields: string]: DocInput;
}

export class DocDocParams implements SolrDocFields, AddDocParams {
  readonly entry_type = SolrEntryEnum.Doc;

  constructor(
    readonly id: string,
    readonly slug: string,
    readonly team: string | null,
    readonly created_at: Date,
    readonly updated_at: Date,
    readonly marked_up_to_date_at: Date,
    readonly up_to_date: boolean,
    readonly title: string,
    readonly creator: string | null,
    readonly maintainer: string | null,
    readonly doc_txt: string
  ) {}

  [docFields: string]: DocInput;
}

export class QnaDocParams implements SolrDocFields, AddDocParams {
  readonly entry_type = SolrEntryEnum.Qna;

  constructor(
    readonly id: string,
    readonly slug: string,
    readonly team: string | null,
    readonly created_at: Date,
    readonly updated_at: Date,
    readonly marked_up_to_date_at: Date,
    readonly up_to_date: boolean,
    readonly title: string,
    readonly creator: string | null,
    readonly maintainer: string | null,
    readonly question_txt: string | null,
    readonly answer_txt: string | null
  ) {}

  [docFields: string]: DocInput;
}
