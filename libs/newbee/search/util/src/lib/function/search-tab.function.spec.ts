import { SolrEntryEnum } from '@newbee/shared/util';
import { SearchTab } from '../enum';
import {
  searchTabToSolrEntry,
  solrEntryToSearchTab,
} from './search-tab.function';

describe('search tab functions', () => {
  describe('searchTabToSolrEntry', () => {
    it('should return the correct value', () => {
      const searchTabs = [
        SearchTab.All,
        SearchTab.Doc,
        SearchTab.People,
        SearchTab.Qna,
        SearchTab.Team,
      ];
      const expected = [
        null,
        SolrEntryEnum.Doc,
        SolrEntryEnum.User,
        SolrEntryEnum.Qna,
        SolrEntryEnum.Team,
      ];

      searchTabs.forEach((searchTab, i) => {
        expect(searchTabToSolrEntry(searchTab)).toEqual(expected[i]);
      });
    });
  });

  describe('solrEntryToSearchTab', () => {
    it('should return the correct value', () => {
      const solrEntries = [
        null,
        SolrEntryEnum.Doc,
        SolrEntryEnum.Qna,
        SolrEntryEnum.Team,
        SolrEntryEnum.User,
      ];
      const expected = [
        SearchTab.All,
        SearchTab.Doc,
        SearchTab.Qna,
        SearchTab.Team,
        SearchTab.People,
      ];

      solrEntries.forEach((solrEntry, i) => {
        expect(solrEntryToSearchTab(solrEntry)).toEqual(expected[i]);
      });
    });
  });
});
