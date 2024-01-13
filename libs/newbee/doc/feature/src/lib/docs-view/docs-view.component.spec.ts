import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { initialDocState } from '@newbee/newbee/doc/data-access';
import { ViewDocsComponent } from '@newbee/newbee/doc/ui';
import { DocActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  SolrEntryEnum,
  testOrganization1,
  testPaginatedResultsDocQueryResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocsViewComponent } from './docs-view.component';

describe('DocsViewComponent', () => {
  let component: DocsViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocsComponent],
      declarations: [DocsViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [`${Keyword.Doc}Module`]: {
              ...initialDocState,
              docs: testPaginatedResultsDocQueryResult1,
            },
          },
        }),
        provideRouter([
          {
            path: '**',
            component: DocsViewComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}`,
      DocsViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('constructor', () => {
    it('should dispatch getDocs and set up _docs', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(DocActions.getDocs());
      expect(component.docs).toEqual(testPaginatedResultsDocQueryResult1);
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the currently selected org', async () => {
      await component.onOrgNavigate('test');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/test`,
      );
    });
  });

  describe('onSearch', () => {
    it('should navigate to the search URL for the query', async () => {
      await component.onSearch('searching');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${Keyword.Search}/searching?${Keyword.Type}=${SolrEntryEnum.Doc}`,
      );
    });
  });

  describe('onScrolled', () => {
    it('should dispatch getDocs', () => {
      component.onScrolled();
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(DocActions.getDocs());
    });
  });
});
