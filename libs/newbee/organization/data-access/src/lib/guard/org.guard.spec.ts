import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { orgGuard } from './org.guard';

describe('orgGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: `:${ShortUrl.Organization}`,
            component: EmptyComponent,
            canActivate: [orgGuard],
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
              selectedOrganization: testOrganizationRelation1,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch store and navigate', async () => {
    await expect(
      router.navigate([`/${testOrganization1.slug}`]),
    ).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      OrganizationActions.getOrg({ orgSlug: testOrganization1.slug }),
    );
    expect(location.path()).toEqual(`/${testOrganization1.slug}`);
  });
});
