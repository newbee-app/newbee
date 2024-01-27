import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authenticatedGuard } from './authenticated.guard';

describe('authenticatedGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        provideRouter([
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
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('logged in', () => {
    it('should navigate properly', async () => {
      store.setState({
        [Keyword.Auth]: { user: testUser1 },
        [Keyword.Cookie]: { csrfToken: 'token' },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(router.url).toEqual('/test');
    });
  });

  describe('not logged in', () => {
    it('should redirect', async () => {
      store.setState({
        [Keyword.Auth]: { user: null },
        [Keyword.Cookie]: { csrfToken: 'token' },
      });
      await expect(router.navigate(['/test'])).resolves.toBeTruthy();
      expect(router.url).toEqual(`/${Keyword.Auth}/${Keyword.Login}`);
    });
  });
});
