import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SearchResultsComponent } from '@newbee/newbee/search/ui';
import { SearchTab } from '@newbee/newbee/search/util';
import {
  SearchActions,
  initialSearchState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  SolrEntryEnum,
  defaultLimit,
  testQueryResults1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SearchResultsViewComponent } from './search-results-view.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultsViewComponent', () => {
  let component: SearchResultsViewComponent;
  let store: MockStore;
  let route: ActivatedRoute;
  let router: Router;

  const testSearchTerm = 'search term';
  const testSearchTermUrl = encodeURIComponent(testSearchTerm);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      declarations: [SearchResultsViewComponent],
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
            path: `${Keyword.Search}/:${Keyword.Search}`,
            component: SearchResultsViewComponent,
          },
          {
            path: '**',
            component: EmptyComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `${Keyword.Search}/${testSearchTerm}?${Keyword.Type}=${SolrEntryEnum.Team}`,
      SearchResultsViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize search term and search results', () => {
      expect(component.searchTerm).toEqual(testSearchTerm);
      expect(component.tab).toEqual(SearchTab.Team);
    });
  });

  describe('onTabChange', () => {
    it('should change tab value and dispatch search', async () => {
      await component.onTabChange(SearchTab.Doc);
      expect(router.url).toEqual(
        `/${Keyword.Search}/${testSearchTermUrl}?${Keyword.Type}=${SolrEntryEnum.Doc}`,
      );
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.search({
          query: {
            offset: 0,
            limit: defaultLimit,
            query: testSearchTerm,
            type: SolrEntryEnum.Doc,
          },
        }),
      );
    });
  });

  describe('onSearch', () => {
    it('should navigate to new search term', async () => {
      const newSearchTerm = 'new search term';
      await component.onSearch(newSearchTerm);
      expect(router.url).toEqual(
        `/${Keyword.Search}/${encodeURIComponent(newSearchTerm)}?${
          Keyword.Type
        }=${SolrEntryEnum.Team}`,
      );
    });
  });

  describe('onSearchbar', () => {
    it('should dispatch suggest', () => {
      component.onSearchbar(testSearchTerm);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.suggest({
          query: { query: testSearchTerm, type: SolrEntryEnum.Team },
        }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('test');
      expect(router.url).toEqual('/test');
    });
  });
});
