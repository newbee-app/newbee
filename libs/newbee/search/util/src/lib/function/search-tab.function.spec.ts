import { SolrOrgEntryEnum } from '@newbee/shared/util';
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
        SolrOrgEntryEnum.Doc,
        SolrOrgEntryEnum.User,
        SolrOrgEntryEnum.Qna,
        SolrOrgEntryEnum.Team,
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
        SolrOrgEntryEnum.Doc,
        SolrOrgEntryEnum.Qna,
        SolrOrgEntryEnum.Team,
        SolrOrgEntryEnum.User,
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
