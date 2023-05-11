import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { magicLinkLoginGuard } from './magic-link-login.guard';

describe('MagicLinkLoginGuard', () => {
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
                path: 'magic-link-login',
                component: EmptyComponent,
                canActivate: [magicLinkLoginGuard],
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

    store.resetSelectors();

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  describe('valid token', () => {
    it('should navigate to /auth/login/magic-link-login', async () => {
      await expect(
        router.navigate(['/auth/login/magic-link-login'], {
          queryParams: { token: '1234' },
        })
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual(
        '/auth/login/magic-link-login?token=1234'
      );
    });
  });

  describe('invalid token', () => {
    it('should redirect to /auth/login', async () => {
      await expect(
        router.navigate(['/auth/login/magic-link-login'])
      ).resolves.toBeTruthy();
      expect(location.path()).toEqual('/auth/login');
    });
  });
});
