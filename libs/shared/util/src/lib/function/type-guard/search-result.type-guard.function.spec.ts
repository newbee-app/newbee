import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
  testUserSearchResult1,
  testWaitlistMemberSearchResult1,
} from '../../example';
import type { AppSearchResultType, OrgSearchResultType } from '../../type';
import {
  isDocSearchResult,
  isOrgMemberSearchResult,
  isQnaSearchResult,
  isTeamSearchResult,
  isUserSearchResult,
  isWaitlistMemberSearchResult,
} from './search-result.type-guard.function';

describe('search result type guards', () => {
  const allOrgSearchResults = [
    testOrgMemberSearchResult1,
    testTeamSearchResult1,
    testDocSearchResult1,
    testQnaSearchResult1,
  ];
  let allOrgSearchResultsSet: Set<OrgSearchResultType>;

  const allAppSearchResults = [
    testUserSearchResult1,
    testWaitlistMemberSearchResult1,
  ];
  let allAppSearchResultsSet: Set<AppSearchResultType>;

  beforeEach(() => {
    allOrgSearchResultsSet = new Set(allOrgSearchResults);
    allAppSearchResultsSet = new Set(allAppSearchResults);
  });

  describe('isOrgMemberSearchResult', () => {
    it('should return true if object is OrgMemberSearchResult', () => {
      expect(isOrgMemberSearchResult(testOrgMemberSearchResult1)).toBeTruthy();
      allOrgSearchResultsSet.delete(testOrgMemberSearchResult1);
      allOrgSearchResultsSet.forEach((searchResult) => {
        expect(isOrgMemberSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isTeamSearchResult', () => {
    it('should return true if object is TeamSearchResult', () => {
      expect(isTeamSearchResult(testTeamSearchResult1)).toBeTruthy();
      allOrgSearchResultsSet.delete(testTeamSearchResult1);
      allOrgSearchResultsSet.forEach((searchResult) => {
        expect(isTeamSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isDocSearchResult', () => {
    it('should return true if object is DocSearchResult', () => {
      expect(isDocSearchResult(testDocSearchResult1)).toBeTruthy();
      allOrgSearchResultsSet.delete(testDocSearchResult1);
      allOrgSearchResultsSet.forEach((searchResult) => {
        expect(isDocSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isQnaSearchResult', () => {
    it('should return true if object is QnaSearchResult', () => {
      expect(isQnaSearchResult(testQnaSearchResult1)).toBeTruthy();
      allOrgSearchResultsSet.delete(testQnaSearchResult1);
      allOrgSearchResultsSet.forEach((searchResult) => {
        expect(isQnaSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isUserSearchResult', () => {
    it('should return true if object is UserSearchResult', () => {
      expect(isUserSearchResult(testUserSearchResult1)).toBeTruthy();
      allAppSearchResultsSet.delete(testUserSearchResult1);
      allAppSearchResultsSet.forEach((searchResult) => {
        expect(isUserSearchResult(searchResult)).toBeFalsy();
      });
    });
  });

  describe('isWaitlistMemberSearchResult', () => {
    it('should return true if object is WaitlistMemberSearchResult', () => {
      expect(
        isWaitlistMemberSearchResult(testWaitlistMemberSearchResult1),
      ).toBeTruthy();
      allAppSearchResultsSet.delete(testWaitlistMemberSearchResult1);
      allAppSearchResultsSet.forEach((searchResult) => {
        expect(isWaitlistMemberSearchResult(searchResult)).toBeFalsy();
      });
    });
  });
});
