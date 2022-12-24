import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent, EmptyComponentModule } from '@newbee/newbee/shared/ui';
import { testBaseCsrfTokenDto1 } from '@newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CsrfActions, initialCsrfState } from '../store';
import { csrfTokenResolver } from './csrf-token.resolver';

describe('CsrfTokenResolver', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponentModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: EmptyComponent,
          },
          {
            path: '1',
            component: EmptyComponent,
            resolve: { csrfToken: csrfTokenResolver },
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: {
            csrf: {
              ...initialCsrfState,
              csrfToken: testBaseCsrfTokenDto1.csrfToken,
            },
          },
        }),
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

  describe('valid csrf token', () => {
    it('should dispatch getCsrfToken', (done) => {
      router.navigate(['/1']).then((navigated) => {
        expect(navigated).toBeTruthy();
        expect(location.path()).toEqual('/1');
        store.scannedActions$.subscribe({
          next: (scannedAction) => {
            try {
              expect(scannedAction).toEqual(CsrfActions.getCsrfToken());
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });
      });
    });
  });
});
