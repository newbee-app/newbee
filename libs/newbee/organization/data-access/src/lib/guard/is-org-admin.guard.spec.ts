import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isOrgAdminGuard } from './is-org-admin.guard';

describe('isOrgAdminGuard', () => {
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
          },
          {
            path: 'test',
            component: EmptyComponent,
            canActivate: [isOrgAdminGuard],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              orgMember: testOrgMemberRelation1,
            },
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
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('non-admin org member', () => {
    it('should redirect to org if org is selected', async () => {
      store.setState({
        [Keyword.Organization]: {
          selectedOrganization: testOrganizationRelation1,
        },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
      );
    });

    it('should redirect to home if org is not selected', async () => {
      store.setState({ [Keyword.Organization]: {} });
      await expect(router.navigate(['/test'])).resolves.toBeFalsy();
      expect(location.path()).toEqual('/');
    });
  });
});
