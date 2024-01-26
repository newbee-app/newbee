import { SolrEntryEnum } from '@newbee/shared/util';
import { SearchTab } from '../enum';

/**
 * Converts a SearchTab to a SolrEntryEnum.
 *
 * @param searchTab The search tab to convert.
 * @returns The SolrEntryEnum that corresponds to the SearchTab, null for `All`.
 */
export function searchTabToSolrEntry(
  searchTab: SearchTab,
): SolrEntryEnum | null {
  switch (searchTab) {
    case SearchTab.All:
      return null;
    case SearchTab.Doc:
      return SolrEntryEnum.Doc;
    case SearchTab.Qna:
      return SolrEntryEnum.Qna;
    case SearchTab.Team:
      return SolrEntryEnum.Team;
    case SearchTab.People:
      return SolrEntryEnum.User;
  }
}

/**
 * Converts a SolrEntryEnum to a SearchTab.
 *
 * @param solrEntry The solr entry to convert.
 * @returns The SearchTab that corresponds to the SolrEntryEnum, `All` if `null` was fed in.
 */
export function solrEntryToSearchTab(
  solrEntry: SolrEntryEnum | null,
): SearchTab {
  switch (solrEntry) {
    case null:
      return SearchTab.All;
    case SolrEntryEnum.Doc:
      return SearchTab.Doc;
    case SolrEntryEnum.Qna:
      return SearchTab.Qna;
    case SolrEntryEnum.Team:
      return SearchTab.Team;
    case SolrEntryEnum.User:
      return SearchTab.People;
  }
}
