import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent, EmptyComponentModule } from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authFeature } from '../store';
import { confirmEmailGuard } from './confirm-email.guard';

describe('ConfirmEmailGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponentModule,
        RouterTestingModule.withRoutes([
          {
            path: 'auth/login',
            component: EmptyComponent,
            children: [
              {
                path: 'confirm-email',
                component: EmptyComponent,
                canActivate: [confirmEmailGuard],
              },
            ],
          },
          { path: '', component: EmptyComponent },
        ]),
      ],
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  describe('valid jwtId and email', () => {
    it('should navigate to /auth/login/confirm-email', async () => {
      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: '1234',
        email: testUser1.email,
      });
      await expect(
        router.navigate(['/auth/login/confirm-email'])
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login/confirm-email');
    });
  });

  describe('invalid jwtId and email', () => {
    it('should redirect to /auth/login', async () => {
      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: null,
        email: null,
      });
      await expect(
        router.navigate(['/auth/login/confirm-email'])
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login');
    });
  });
});