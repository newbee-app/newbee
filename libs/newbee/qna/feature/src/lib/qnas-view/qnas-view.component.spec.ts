import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { initialQnaState } from '@newbee/newbee/qna/data-access';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { ViewPostsComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  SolrEntryEnum,
  testOrganization1,
  testPaginatedResultsQnaQueryResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QnasViewComponent } from './qnas-view.component';

describe('QnasViewComponent', () => {
  let component: QnasViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostsComponent],
      declarations: [QnasViewComponent],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        provideMockStore({
          initialState: {
            [`${Keyword.Qna}Module`]: {
              ...initialQnaState,
              qnas: testPaginatedResultsQnaQueryResult1,
            },
          },
        }),
        provideRouter([
          {
            path: '**',
            component: QnasViewComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}`,
      QnasViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('constructor', () => {
    it('should dispatch getQnas', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(QnaActions.getQnas());
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
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${Keyword.Search}/searching?${Keyword.Type}=${SolrEntryEnum.Qna}`,
      );
    });
  });

  describe('onContinueSearch', () => {
    it('should dispatch getDocs', () => {
      component.onContinueSearch();
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(QnaActions.getQnas());
    });
  });
});
