import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import { ViewPostsComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { initialTeamState } from '@newbee/newbee/team/data-access';
import {
  Keyword,
  SolrOrgEntryEnum,
  testOrganization1,
  testPaginatedResultsQnaSearchResult1,
  testTeam1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamQnasViewComponent } from './team-qnas-view.component';

describe('TeamQnasViewComponent', () => {
  let component: TeamQnasViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostsComponent],
      declarations: [TeamQnasViewComponent],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        provideMockStore({
          initialState: {
            [`${Keyword.Team}Module`]: {
              ...initialTeamState,
              qnas: testPaginatedResultsQnaSearchResult1,
            },
          },
        }),
        provideRouter([
          {
            path: `${ShortUrl.Organization}/:${ShortUrl.Organization}/${ShortUrl.Team}/:${ShortUrl.Team}`,
            children: [
              {
                path: ShortUrl.Qna,
                component: TeamQnasViewComponent,
              },
            ],
          },
          { path: '**', component: TeamQnasViewComponent },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}/${ShortUrl.Qna}`,
      TeamQnasViewComponent,
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
      expect(store.dispatch).toHaveBeenCalledWith(TeamActions.getQnas());
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the currently selected org', async () => {
      await component.onOrgNavigate({ route: 'test' });
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/test`,
      );
    });
  });

  describe('onSearch', () => {
    it('should navigate to the search URL for the query', async () => {
      await component.onSearch('searching');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${Keyword.Search}/searching?${Keyword.Type}=${SolrOrgEntryEnum.Qna}&${ShortUrl.Team}=${testTeam1.slug}`,
      );
    });
  });

  describe('onContinueSearch', () => {
    it('should dispatch getDocs', () => {
      component.onContinueSearch();
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(TeamActions.getQnas());
    });
  });
});
