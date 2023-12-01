import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  initialDocState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testDoc1,
  testDocRelation1,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { canEditDocGuard } from './can-edit-doc.guard';

describe('canEditDocGuard', () => {
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
                path: `${ShortUrl.Doc}/:${ShortUrl.Doc}/${Keyword.Edit}`,
                component: EmptyComponent,
                canActivate: [canEditDocGuard],
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

  it('should redirect to org if no permissions, doc not set, and selectedOrganization is set', async () => {
    store.setState({
      [Keyword.Organization]: {
        ...initialOrganizationState,
        selectedOrganization: testOrganizationRelation1,
      },
      [Keyword.Doc]: initialDocState,
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}/${testDoc1.slug}/${Keyword.Edit}`,
      ]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(
      `/${ShortUrl.Organization}/${testOrganization1.slug}`,
    );
  });

  it('should redirect home if no permissions, doc not set, and selectedOrganization not set', async () => {
    store.setState({
      [Keyword.Organization]: initialOrganizationState,
      [Keyword.Doc]: initialDocState,
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}/${testDoc1.slug}/${Keyword.Edit}`,
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
      [Keyword.Doc]: {
        ...initialDocState,
        selectedDoc: testDocRelation1,
        teamMember: testTeamMember1,
      },
    });
    await expect(
      router.navigate([
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}/${testDoc1.slug}/${Keyword.Edit}`,
      ]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}/${testDoc1.slug}/${Keyword.Edit}`,
    );
  });
});
