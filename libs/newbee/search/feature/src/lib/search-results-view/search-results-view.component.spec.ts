import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { SearchResultsComponent } from '@newbee/newbee/search/ui';
import { SearchTab } from '@newbee/newbee/search/util';
import {
  SearchActions,
  initialSearchState,
} from '@newbee/newbee/shared/data-access';
import { Keyword, SolrEntryEnum, testQueryResult1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { SearchResultsViewComponent } from './search-results-view.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultsViewComponent', () => {
  let component: SearchResultsViewComponent;
  let fixture: ComponentFixture<SearchResultsViewComponent>;
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
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>({
            paramMap: of(
              convertToParamMap({ [Keyword.Search]: testSearchTerm }),
            ),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsViewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
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
      expect(store.dispatch).toBeCalledWith(
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
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith([`../${newSearchTerm}`], {
        relativeTo: route,
      });
    });
  });

  describe('onSearchbar', () => {
    it('should dispatch suggest', () => {
      component.onSearchbar(testSearchTerm);
      expect(store.dispatch).toBeCalledWith(
        SearchActions.suggest({ query: { query: testSearchTerm } }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('test');
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../../test'], {
        relativeTo: route,
      });
    });
  });

  describe('onScrolled', () => {
    it('should do nothing if all results are being shown', () => {
      component.onScrolled();
      expect(store.dispatch).not.toBeCalled();

      component.searchResults = testQueryResult1;
      component.onScrolled();
      expect(store.dispatch).not.toBeCalled();

      component.searchResults = { ...testQueryResult1, total: 10, offset: 0 };
      component.onScrolled();
      expect(store.dispatch).not.toBeCalled();

      component.searchResults = { ...testQueryResult1, total: 100, offset: 8 };
      component.onScrolled();
      expect(store.dispatch).toBeCalledWith(
        SearchActions.search({
          query: { offset: 9, query: testSearchTerm },
        }),
      );
    });
  });
});
