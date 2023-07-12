import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatorActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { testAuthenticator1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authenticatorsResolver } from './authenticators.resolver';

describe('authenticatorsResolver', () => {
  let router: Router;
  let store: MockStore;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: UrlEndpoint.Authenticator,
            component: EmptyComponent,
            resolve: [authenticatorsResolver],
          },
          { path: '', component: EmptyComponent },
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

  it('should dispatch getAuthenticators', async () => {
    store.setState({ userModule: { authenticators: [testAuthenticator1] } });
    await expect(
      router.navigate([UrlEndpoint.Authenticator])
    ).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      AuthenticatorActions.getAuthenticators()
    );
  });
});
