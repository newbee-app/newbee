import { SolrEntryEnum } from '@newbee/shared/util';
import { SearchTab } from '../enum';

/**
 * Converts a SearchTab to a SolrEntryEnum.
 *
 * @param searchTab The search tab to convert.
 * @returns The SolrEntryEnum that corresponds to the SearchTab, null for `All`.
 */
export function serachTabToSolrEntry(
  searchTab: SearchTab
): SolrEntryEnum | null {
  switch (searchTab) {
    case SearchTab.All:
      return null;
    case SearchTab.Doc:
      return SolrEntryEnum.Doc;
    case SearchTab.People:
      return SolrEntryEnum.User;
    case SearchTab.Qna:
      return SolrEntryEnum.Qna;
    case SearchTab.Team:
      return SolrEntryEnum.Team;
  }
}
