import { SolrEntryEnum, proxiedPropertiesOf } from '@newbee/shared/util';
import { SolrDocFields } from '../class';

/**
 * The Solr configset to use for a new index, created when an organization is created.
 */
export const newOrgConfigset = 'newbee_org';

/**
 * The names of the dictionaries that can be used with the suggester or spellchecker.
 */
export const solrDictionaries = {
  ...SolrEntryEnum,
  all: 'all',
};

/**
 * All of the fields that exist in NewBee's Solr config.
 */
export const solrFields = proxiedPropertiesOf<SolrDocFields>();

/**
 * The fields that are highlighted by Solr by default.
 */
export const solrDefaultHighlightedFields = {
  [solrFields.doc_txt]: solrFields.doc_txt,
  [solrFields.question_txt]: solrFields.question_txt,
  [solrFields.answer_txt]: solrFields.answer_txt,
};
