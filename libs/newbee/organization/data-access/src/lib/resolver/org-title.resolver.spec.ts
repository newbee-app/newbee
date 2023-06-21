import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialHttpState,
  initialOrganizationState,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { UrlEndpoint } from '@newbee/shared/data-access';
import {
  forbiddenError,
  testOrganization1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { orgTitleResolver } from './org-title.resolver';

describe('OrgTitleResolver', () => {
  let router: Router;
  let store: MockStore;
  let location: Location;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: `:${UrlEndpoint.Organization}`,
            component: EmptyComponent,
            title: orgTitleResolver,
          },
          { path: '', component: EmptyComponent },
        ]),
      ],
      providers: [provideMockStore()],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    title = TestBed.inject(Title);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it(`should dispatch getOrg and set title to org's name`, async () => {
    store.setState({
      organization: {
        ...initialOrganizationState,
        selectedOrganization: testOrgMemberRelation1,
      },
    });
    await expect(
      router.navigate([`/${testOrganization1.slug}`])
    ).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      OrganizationActions.getOrg({ orgSlug: testOrganization1.slug })
    );
    expect(location.path()).toEqual(`/${testOrganization1.slug}`);
    expect(title.getTitle()).toEqual(testOrganization1.name);
  });

  it('should set title to Error if store has error instead of selected org', async () => {
    store.setState({
      http: {
        ...initialHttpState,
        error: { status: 403, messages: { misc: forbiddenError } },
      },
    });
    await expect(
      router.navigate([`/${testOrganization1.slug}`])
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testOrganization1.slug}`);
    expect(title.getTitle()).toEqual('Error');
  });
});
