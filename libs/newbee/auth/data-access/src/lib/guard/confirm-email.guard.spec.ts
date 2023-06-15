import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authFeature, initialAuthState } from '../store';
import { confirmEmailGuard } from './confirm-email.guard';

describe('ConfirmEmailGuard', () => {
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
            children: [
              {
                path: 'confirm-email',
                component: EmptyComponent,
                canActivate: [confirmEmailGuard],
              },
            ],
          },
        ]),
      ],
      providers: [provideMockStore()],
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

  describe('valid jwtId and email', () => {
    it('should navigate properly', async () => {
      store.overrideSelector(authFeature.selectAuthModuleState, {
        jwtId: '1234',
        email: testUser1.email,
        pendingMagicLink: false,
        pendingWebAuthn: false,
      });
      await expect(
        router.navigate(['/auth/login/confirm-email'])
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login/confirm-email');
    });
  });

  describe('invalid jwtId and email', () => {
    it('should redirect', async () => {
      store.overrideSelector(
        authFeature.selectAuthModuleState,
        initialAuthState
      );
      await expect(
        router.navigate(['/auth/login/confirm-email'])
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login');
    });
  });
});
