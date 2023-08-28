import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
} from '../../example';
import { AllQueryResults } from '../../type';
import {
  resultIsDocQueryResult,
  resultIsOrgMemberQueryResult,
  resultIsQnaQueryResult,
  resultIsTeamQueryResult,
} from './search-result.type-guard.function';

describe('search result type guards', () => {
  const allQueryResults = [
    testOrgMemberQueryResult1,
    testTeamQueryResult1,
    testDocQueryResult1,
    testQnaQueryResult1,
  ];
  let allQueryResultsSet: Set<AllQueryResults>;

  beforeEach(() => {
    allQueryResultsSet = new Set(allQueryResults);
  });

  describe('resultIsOrgMemberQueryResult', () => {
    it('should return true if object is orgMemberQueryResult', () => {
      expect(
        resultIsOrgMemberQueryResult(testOrgMemberQueryResult1)
      ).toBeTruthy();
      allQueryResultsSet.delete(testOrgMemberQueryResult1);
      allQueryResultsSet.forEach((queryResult) => {
        expect(resultIsOrgMemberQueryResult(queryResult)).toBeFalsy();
      });
    });
  });

  describe('resultIsTeamQueryResult', () => {
    it('should return true if object is teamQueryResult', () => {
      expect(resultIsTeamQueryResult(testTeamQueryResult1)).toBeTruthy();
      allQueryResultsSet.delete(testTeamQueryResult1);
      allQueryResultsSet.forEach((queryResult) => {
        expect(resultIsTeamQueryResult(queryResult)).toBeFalsy();
      });
    });
  });

  describe('resultIsDocQueryResult', () => {
    it('should return true if object is docQueryResult', () => {
      expect(resultIsDocQueryResult(testDocQueryResult1)).toBeTruthy();
      allQueryResultsSet.delete(testDocQueryResult1);
      allQueryResultsSet.forEach((queryResult) => {
        expect(resultIsDocQueryResult(queryResult)).toBeFalsy();
      });
    });
  });

  describe('resultIsQnaQueryResult', () => {
    it('should return true if object is qnaQueryResult', () => {
      expect(resultIsQnaQueryResult(testQnaQueryResult1)).toBeTruthy();
      allQueryResultsSet.delete(testQnaQueryResult1);
      allQueryResultsSet.forEach((queryResult) => {
        expect(resultIsQnaQueryResult(queryResult)).toBeFalsy();
      });
    });
  });
});
