import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CookieActions } from '../store';
import { cookieGuard } from './cookie.guard';

describe('cookieGuard', () => {
  let router: Router;
  let store: MockStore;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            canActivate: [cookieGuard],
            component: EmptyComponent,
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
      providers: [provideMockStore()],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch initCookies and then navigate', async () => {
    store.setState({ cookie: { csrfToken: 'token' } });
    await expect(router.navigate(['/test'])).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(CookieActions.initCookies());
    expect(location.path()).toEqual('/test');
  });
});
