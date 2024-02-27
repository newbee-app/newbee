import {
  SolrAppEntryEnum,
  SolrOrgEntryEnum,
  proxiedPropertiesOf,
} from '@newbee/shared/util';
import { SolrAppFields, SolrOrgFields } from '../class';

/**
 * The Solr configset to use for a new index, created when an organization is created.
 */
export const solrOrgConfigset = 'newbee_org';

/**
 * The Solr configset to use for the app-wide collection.
 */
export const solrAppConfigset = 'newbee';

/**
 * The name to use for the app-wide Solr collection.
 */
export const solrAppCollection = solrAppConfigset;

/**
 * The names of the dictionaries that can be used with the org suggester or spellchecker.
 */
export const solrOrgDictionaries = {
  ...SolrOrgEntryEnum,
  All: 'all',
};

/**
 * The names of the dictionaries that can be used with the app suggester or spellchecker.
 */
export const solrAppDictionaries = {
  ...SolrAppEntryEnum,
  All: 'all',
};

/**
 * All of the fields that exist in NewBee's Solr org config.
 */
export const solrOrgFields = proxiedPropertiesOf<SolrOrgFields>();

/**
 * All of the fields that exist in NewBee's Solr app config.
 */
export const solrAppFields = proxiedPropertiesOf<SolrAppFields>();

/**
 * The org fields that are highlighted by Solr by default.
 */
export const solrOrgDefaultHighlightedFields = {
  [solrOrgFields.doc_txt]: solrOrgFields.doc_txt,
  [solrOrgFields.question_txt]: solrOrgFields.question_txt,
  [solrOrgFields.answer_txt]: solrOrgFields.answer_txt,
};
