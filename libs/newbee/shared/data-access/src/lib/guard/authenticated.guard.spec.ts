import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authenticatedGuard } from './authenticated.guard';

describe('authenticatedGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: `${Keyword.Auth}/${Keyword.Login}`,
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

  describe('logged in', () => {
    it('should navigate properly', async () => {
      store.setState({
        [Keyword.Auth]: { user: testUser1 },
        [Keyword.Cookie]: { csrfToken: 'token' },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual('/test');
    });
  });

  describe('not logged in', () => {
    it('should redirect', async () => {
      store.setState({
        [Keyword.Auth]: { user: null },
        [Keyword.Cookie]: { csrfToken: 'token' },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(location.path()).toEqual(`/${Keyword.Auth}/${Keyword.Login}`);
    });
  });
});
