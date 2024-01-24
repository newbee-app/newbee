import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavbarComponent } from './navbar.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let store: MockStore;
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideMockStore({ initialState: { [Keyword.Auth]: { user: null } } }),
        provideRouter([{ path: '**', component: NavbarComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', NavbarComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(harness).toBeDefined();
  });

  describe('constructor', () => {
    it('should set includeCenter to true if route is past org home', async () => {
      expect(component.includeCenter).toBeFalsy();

      store.setState({
        [Keyword.Organization]: {
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(component.includeCenter).toBeTruthy();

      component = await harness.navigateByUrl(
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
        NavbarComponent,
      );
      expect(component.includeCenter).toBeFalsy();
    });
  });

  describe('onSelectedOrganizationChange', () => {
    it('should navigate to org', async () => {
      await component.onSelectedOrganizationChange(testOrganization1);
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
      );
    });
  });

  describe('onNavigateToLink', () => {
    it('should navigate', async () => {
      await component.onNavigateToLink({ route: 'test' });
      expect(router.url).toEqual('/test');
    });
  });

  describe('logout', () => {
    it('should dispatch logout', () => {
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
    });
  });
});
