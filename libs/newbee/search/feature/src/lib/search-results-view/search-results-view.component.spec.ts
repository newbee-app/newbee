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
import { Keyword, SolrEntryEnum, testQueryResult1 } from '@newbee/shared/util';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      declarations: [SearchResultsViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: {
              ...initialSearchState,
              searchResult: testQueryResult1,
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
      `${Keyword.Search}/${testSearchTerm}`,
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
      expect(component.searchResults).toEqual(testQueryResult1);
    });
  });

  describe('onTabChange', () => {
    it('should change tab value and dispatch search', () => {
      component.onTabChange(SearchTab.Doc);
      expect(component.tab).toEqual(SearchTab.Doc);
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.search({
          query: { offset: 0, type: SolrEntryEnum.Doc, query: testSearchTerm },
        }),
      );
    });
  });

  describe('onSearch', () => {
    it('should navigate to new search term', async () => {
      const newSearchTerm = 'new search term';
      await component.onSearch(newSearchTerm);
      expect(router.url).toEqual(
        `/${Keyword.Search}/${encodeURIComponent(newSearchTerm)}`,
      );
    });
  });

  describe('onSearchbar', () => {
    it('should dispatch suggest', () => {
      component.onSearchbar(testSearchTerm);
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.suggest({ query: { query: testSearchTerm } }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('test');
      expect(router.url).toEqual('/test');
    });
  });

  describe('onScrolled', () => {
    it('should do nothing if all results are being shown', () => {
      component.onScrolled();
      expect(store.dispatch).not.toHaveBeenCalled();

      component.searchResults = testQueryResult1;
      component.onScrolled();
      expect(store.dispatch).not.toHaveBeenCalled();

      component.searchResults = { ...testQueryResult1, total: 10, offset: 0 };
      component.onScrolled();
      expect(store.dispatch).not.toHaveBeenCalled();

      component.searchResults = { ...testQueryResult1, total: 100, offset: 8 };
      component.onScrolled();
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.search({
          query: { offset: 9, query: testSearchTerm },
        }),
      );
    });
  });
});
