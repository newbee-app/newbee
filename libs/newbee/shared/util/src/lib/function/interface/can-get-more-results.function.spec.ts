import { testPaginatedResultsDocQueryResult1 } from '@newbee/shared/util';
import { canGetMoreResults } from './can-get-more-results.function';

describe('canGetMoreResults', () => {
  it('should account for null', () => {
    expect(canGetMoreResults(null)).toBeTruthy();
  });

  it('should return true if there are more results to fetch', () => {
    expect(canGetMoreResults(testPaginatedResultsDocQueryResult1)).toBeFalsy();
    expect(
      canGetMoreResults({ ...testPaginatedResultsDocQueryResult1, total: 100 }),
    ).toBeTruthy();
  });
});
