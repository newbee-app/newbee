import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authFeature } from '../store';
import { authenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'auth/login',
            component: EmptyComponent,
          },
          {
            path: 'test',
            component: EmptyComponent,
            canActivate: [authenticatedGuard],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
      providers: [
        provideMockStore({ initialState: { cookie: { csrfToken: 'token' } } }),
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

  describe('valid user', () => {
    it('should navigate properly', async () => {
      store.overrideSelector(authFeature.selectUser, testUser1);
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('invalid user', () => {
    it('should redirect', async () => {
      store.overrideSelector(authFeature.selectUser, null);
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login');
    });
  });
});
