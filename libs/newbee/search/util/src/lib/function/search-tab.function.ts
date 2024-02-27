import { SolrOrgEntryEnum } from '@newbee/shared/util';
import { SearchTab } from '../enum';

/**
 * Converts a SearchTab to a SolrOrgEntryEnum.
 *
 * @param searchTab The search tab to convert.
 * @returns The SolrOrgEntryEnum that corresponds to the SearchTab, null for `All`.
 */
export function searchTabToSolrEntry(
  searchTab: SearchTab,
): SolrOrgEntryEnum | null {
  switch (searchTab) {
    case SearchTab.All:
      return null;
    case SearchTab.Doc:
      return SolrOrgEntryEnum.Doc;
    case SearchTab.Qna:
      return SolrOrgEntryEnum.Qna;
    case SearchTab.Team:
      return SolrOrgEntryEnum.Team;
    case SearchTab.People:
      return SolrOrgEntryEnum.User;
  }
}

/**
 * Converts a SolrOrgEntryEnum to a SearchTab.
 *
 * @param solrEntry The solr entry to convert.
 * @returns The SearchTab that corresponds to the SolrOrgEntryEnum, `All` if `null` was fed in.
 */
export function solrEntryToSearchTab(
  solrEntry: SolrOrgEntryEnum | null,
): SearchTab {
  switch (solrEntry) {
    case null:
      return SearchTab.All;
    case SolrOrgEntryEnum.Doc:
      return SearchTab.Doc;
    case SolrOrgEntryEnum.Qna:
      return SearchTab.Qna;
    case SolrOrgEntryEnum.Team:
      return SearchTab.Team;
    case SolrOrgEntryEnum.User:
      return SearchTab.People;
  }
}
