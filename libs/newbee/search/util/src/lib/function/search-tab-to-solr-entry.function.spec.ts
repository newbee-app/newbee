import { SolrEntryEnum } from '@newbee/shared/util';
import { SearchTab } from '../enum';
import { serachTabToSolrEntry } from './search-tab-to-solr-entry.function';

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

    searchTabs.forEach((searchTab, i) =>
      expect(serachTabToSolrEntry(searchTab)).toEqual(expected[i])
    );
  });
});
