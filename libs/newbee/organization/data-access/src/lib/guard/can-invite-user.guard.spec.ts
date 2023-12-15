import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { initialOrganizationState } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { canInviteUserGuard } from './can-invite-user.guard';

describe('canInviteUserGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              orgMember: {
                ...testOrgMemberRelation1,
                orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
              },
            },
          },
        }),
        provideRouter([
          {
            path: `${ShortUrl.Organization}/:${ShortUrl.Organization}`,
            component: EmptyComponent,
          },
          {
            path: 'test',
            canActivate: [canInviteUserGuard],
            component: EmptyComponent,
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
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

  describe('member org member', () => {
    it('should navigate properly', async () => {
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('not org member', () => {
    it('should redirect to org if org is selected', async () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
      );
    });

    it('should redirect to home if org is not selected', async () => {
      store.setState({ [Keyword.Organization]: initialOrganizationState });
      await expect(router.navigate(['/test'])).resolves.toBeFalsy();
      expect(location.path()).toEqual('');
    });
  });
});
