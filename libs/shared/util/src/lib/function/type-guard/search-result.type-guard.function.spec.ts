import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '../../example';
import type { OrgSearchResultType } from '../../type';
import {
  isDocSearchResult,
  isOrgMemberSearchResult,
  isQnaSearchResult,
  isTeamSearchResult,
} from './search-result.type-guard.function';

describe('search result type guards', () => {
  const allSearchResults = [
    testOrgMemberSearchResult1,
    testTeamSearchResult1,
    testDocSearchResult1,
    testQnaSearchResult1,
  ];
  let allSearchResultsSet: Set<OrgSearchResultType>;

  beforeEach(() => {
    allSearchResultsSet = new Set(allSearchResults);
  });

  describe('isOrgMemberSearchResult', () => {
    it('should return true if object is OrgMemberSearchResult', () => {
      expect(isOrgMemberSearchResult(testOrgMemberSearchResult1)).toBeTruthy();
      allSearchResultsSet.delete(testOrgMemberSearchResult1);
      allSearchResultsSet.forEach((searchResult) => {
        expect(isOrgMemberSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isTeamSearchResult', () => {
    it('should return true if object is TeamSearchResult', () => {
      expect(isTeamSearchResult(testTeamSearchResult1)).toBeTruthy();
      allSearchResultsSet.delete(testTeamSearchResult1);
      allSearchResultsSet.forEach((searchResult) => {
        expect(isTeamSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isDocSearchResult', () => {
    it('should return true if object is DocSearchResult', () => {
      expect(isDocSearchResult(testDocSearchResult1)).toBeTruthy();
      allSearchResultsSet.delete(testDocSearchResult1);
      allSearchResultsSet.forEach((searchResult) => {
        expect(isDocSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isQnaSearchResult', () => {
    it('should return true if object is QnaSearchResult', () => {
      expect(isQnaSearchResult(testQnaSearchResult1)).toBeTruthy();
      allSearchResultsSet.delete(testQnaSearchResult1);
      allSearchResultsSet.forEach((searchResult) => {
        expect(isQnaSearchResult(searchResult)).toBeFalsy();
      });
    });
  });
});
