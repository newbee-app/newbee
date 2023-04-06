import { SolrEntryEnum } from '@newbee/shared/util';
import type { AddDocParams, DocInput } from '@newbee/solr-cli';
import type { SolrDocFields } from '../interface';

export class OrgMemberDocParams implements SolrDocFields, AddDocParams {
  readonly entry_type = SolrEntryEnum.User;

  constructor(
    readonly id: string,
    readonly slug: string,
    readonly user_name: string,
    readonly user_display_name: string | null
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
    readonly creator: string,
    readonly maintainer: string | null,
    readonly doc_title: string,
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
    readonly creator: string,
    readonly maintainer: string | null,
    readonly qna_title: string,
    readonly question_txt: string | null,
    readonly answer_txt: string | null
  ) {}

  [docFields: string]: DocInput;
}
