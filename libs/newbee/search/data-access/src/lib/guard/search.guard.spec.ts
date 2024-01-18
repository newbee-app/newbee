import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  initialSearchState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  SolrEntryEnum,
  testBaseQueryDto1,
  testQueryResults1,
  testTeam1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { searchGuard } from './search.guard';

describe('searchGuard', () => {
  let store: MockStore;
  let router: Router;

  const encodedQuery = encodeURIComponent(testBaseQueryDto1.query);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: {
              ...initialSearchState,
              searchResults: testQueryResults1,
            },
          },
        }),
        provideRouter([
          {
            path: `:${Keyword.Search}`,
            component: EmptyComponent,
            canActivate: [searchGuard],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  it('should dispatch search to store and navigate', async () => {
    await expect(
      router.navigate([`/${testBaseQueryDto1.query}`]),
    ).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.search({ query: testBaseQueryDto1 }),
    );
    expect(router.url).toEqual(`/${encodedQuery}`);
  });

  it('should account for type query param', async () => {
    await expect(
      router.navigate([`/${testBaseQueryDto1.query}`], {
        queryParams: { [Keyword.Type]: SolrEntryEnum.Doc },
      }),
    ).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.search({
        query: { ...testBaseQueryDto1, type: SolrEntryEnum.Doc },
      }),
    );
    expect(router.url).toEqual(
      `/${encodedQuery}?${Keyword.Type}=${SolrEntryEnum.Doc}`,
    );
  });

  it('should account for team query param', async () => {
    await expect(
      router.navigate([`/${testBaseQueryDto1.query}`], {
        queryParams: { [ShortUrl.Team]: testTeam1.slug },
      }),
    ).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.search({
        query: { ...testBaseQueryDto1, team: testTeam1.slug },
      }),
    );
    expect(router.url).toEqual(
      `/${encodedQuery}?${ShortUrl.Team}=${testTeam1.slug}`,
    );
  });
});
