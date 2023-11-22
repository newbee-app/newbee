import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  forbiddenError,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { orgTitleResolver } from './org-title.resolver';

describe('orgTitleResolver', () => {
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
            path: `:${ShortUrl.Organization}`,
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

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it(`should set title to org's name`, async () => {
    store.setState({
      [Keyword.Organization]: {
        ...initialOrganizationState,
        selectedOrganization: testOrganizationRelation1,
      },
    });
    await expect(
      router.navigate([`/${testOrganization1.slug}`]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testOrganization1.slug}`);
    expect(title.getTitle()).toEqual(testOrganization1.name);
  });

  it('should set title to Error if store has error instead of selected org', async () => {
    store.setState({
      [Keyword.Http]: {
        ...initialHttpState,
        screenError: { status: 403, message: forbiddenError },
      },
    });
    await expect(
      router.navigate([`/${testOrganization1.slug}`]),
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testOrganization1.slug}`);
    expect(title.getTitle()).toEqual('Error');
  });
});
