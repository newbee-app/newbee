import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialSearchState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  SolrEntryEnum,
  testBaseQueryDto1,
  testBaseSuggestDto1,
  testQueryResults1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { searchGuard } from './search.guard';

describe('searchGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
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
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: {
              ...initialSearchState,
              searchResults: testQueryResults1,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch search to store and navigate', async () => {
    await expect(
      router.navigate([`/${testBaseQueryDto1.query}`]),
    ).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.search({ query: testBaseQueryDto1 }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.suggest({ query: testBaseSuggestDto1 }),
    );
    expect(location.path()).toEqual(
      `/${encodeURIComponent(testBaseQueryDto1.query)}`,
    );
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
    expect(store.dispatch).toHaveBeenCalledWith(
      SearchActions.suggest({
        query: { ...testBaseSuggestDto1, type: SolrEntryEnum.Doc },
      }),
    );
    expect(location.path()).toEqual(
      `/${encodeURIComponent(testBaseQueryDto1.query)}?${Keyword.Type}=${
        SolrEntryEnum.Doc
      }`,
    );
  });
});
