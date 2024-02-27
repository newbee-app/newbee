import { testPaginatedResultsDocSearchResult1 } from '@newbee/shared/util';
import { canGetMoreResults } from './can-get-more-results.function';

describe('canGetMoreResults', () => {
  it('should account for null', () => {
    expect(canGetMoreResults(null)).toBeTruthy();
  });

  it('should return true if there are more results to fetch', () => {
    expect(canGetMoreResults(testPaginatedResultsDocSearchResult1)).toBeFalsy();
    expect(
      canGetMoreResults({
        ...testPaginatedResultsDocSearchResult1,
        total: 100,
      }),
    ).toBeTruthy();
  });
});
