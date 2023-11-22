import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
  testQna1,
  testQnaRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { canEditQnaGuard } from './can-edit-qna.guard';

describe('canEditQnaGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: `${ShortUrl.Organization}/:${ShortUrl.Organization}`,
            component: EmptyComponent,
            children: [
              {
                path: `${ShortUrl.Qna}/:${ShortUrl.Qna}/${Keyword.Edit}`,
                component: EmptyComponent,
                canActivate: [canEditQnaGuard],
              },
            ],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should redirect to org if no permissions, qna not set, and selectedOrganization is set', async () => {
    store.setState({
      [Keyword.Organization]: {
        ...initialOrganizationState,
        selectedOrganization: testOrganizationRelation1,
      },
      [Keyword.Qna]: initialQnaState,
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}/${testQna1.slug}/${Keyword.Edit}`,
      ]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(
      `/${ShortUrl.Organization}/${testOrganization1.slug}`,
    );
  });

  it('should redirect home if no permissions, qna not set, and selectedOrganizatio not set', async () => {
    store.setState({
      [Keyword.Organization]: initialOrganizationState,
      [Keyword.Qna]: initialQnaState,
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}/${testQna1.slug}/${Keyword.Edit}`,
      ]),
    ).resolves.toBeFalsy();
    expect(location.path()).toEqual('');
  });

  it('should allow if permissions are met', async () => {
    store.setState({
      [Keyword.Organization]: {
        ...initialOrganizationState,
        selectedOrganization: testOrganizationRelation1,
        orgMember: testOrgMemberRelation1,
      },
      [Keyword.Qna]: {
        ...initialQnaState,
        selectedQna: testQnaRelation1,
        teamMember: testTeamMember1,
      },
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}/${testQna1.slug}/${Keyword.Edit}`,
      ]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}/${testQna1.slug}/${Keyword.Edit}`,
    );
  });
});
