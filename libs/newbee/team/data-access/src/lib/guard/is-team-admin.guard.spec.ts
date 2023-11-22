import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
  testTeamMember1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isTeamAdminGuard } from './is-team-admin.guard';

describe('isTeamAdminGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: `${ShortUrl.Organization}/:${ShortUrl.Organization}`,
            component: EmptyComponent,
            children: [
              {
                path: `${ShortUrl.Team}/:${ShortUrl.Team}}`,
                component: EmptyComponent,
              },
            ],
          },
          {
            path: 'test',
            component: EmptyComponent,
            canActivate: [isTeamAdminGuard],
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Team]: initialTeamState,
          },
        }),
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

  describe('admin org member', () => {
    it('should navigate properly', async () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          orgMember: testOrgMemberRelation1,
        },
        [Keyword.Team]: initialTeamState,
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('admin team member', () => {
    it('should navigate properly', async () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: { ...initialTeamState, teamMember: testTeamMember1 },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('non-admin', () => {
    it('should navigate home if org and team are not set', async () => {
      await expect(router.navigate(['/test'])).resolves.toBeFalsy();
      expect(location.path()).toEqual('/');
    });

    it('should navigate to org if only org is set', async () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: initialTeamState,
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
      );
    });

    it('should navigate to team if org and team are set', async () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeamRelation1.team.slug}`,
      );
    });
  });
});
