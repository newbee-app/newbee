import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { initialOrgMemberState } from '@newbee/newbee/org-member/data-access';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { ViewPostsComponent } from '@newbee/newbee/shared/ui';
import { OrgMemberPostTab, ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  SolrOrgEntryEnum,
  testOrgMember1,
  testOrganization1,
  testPaginatedResultsDocSearchResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgMemberDocsViewComponent } from './org-member-docs-view.component';

describe('OrgMemberDocsViewComponent', () => {
  let component: OrgMemberDocsViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostsComponent],
      declarations: [OrgMemberDocsViewComponent],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        provideMockStore({
          initialState: {
            [`${Keyword.Member}Module`]: {
              ...initialOrgMemberState,
              docs: testPaginatedResultsDocSearchResult1,
            },
          },
        }),
        provideRouter([
          {
            path: `${ShortUrl.Organization}/:${ShortUrl.Organization}/${ShortUrl.Member}/:${ShortUrl.Member}`,
            children: [
              {
                path: ShortUrl.Doc,
                component: OrgMemberDocsViewComponent,
              },
              {
                path: '',
                component: OrgMemberDocsViewComponent,
              },
            ],
          },
          {
            path: '**',
            component: OrgMemberDocsViewComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}/${ShortUrl.Doc}`,
      OrgMemberDocsViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('constructor', () => {
    it('should subscribe to route params and fire a request to get docs', () => {
      expect(component.role).toBeNull();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrgMemberActions.getDocs({ role: null }),
      );
      expect(component.orgMemberSlug).toEqual(testOrgMember1.slug);
    });
  });

  describe('onOrgMemberTabChange', () => {
    it('should navigate to reflect tab change', async () => {
      await component.onOrgMemberTabChange(OrgMemberPostTab.Maintained);
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}/${ShortUrl.Doc}?${Keyword.Role}=maintainer`,
      );
      expect(component.role).toEqual('maintainer');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrgMemberActions.getDocs({ role: 'maintainer' }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the currently selected org', async () => {
      await component.onOrgNavigate({ route: '/test' });
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/test`,
      );
    });
  });

  describe('onSearch', () => {
    it('should navigate to search', async () => {
      await component.onSearch('searching');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${Keyword.Search}/searching?${Keyword.Type}=${SolrOrgEntryEnum.Doc}&${ShortUrl.Member}=${testOrgMember1.slug}`,
      );
    });
  });
});
