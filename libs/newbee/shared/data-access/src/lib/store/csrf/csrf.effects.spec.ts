import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { testBaseCsrfTokenDto1 } from '@newbee/shared/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { CsrfService } from '../../service';
import { CsrfActions } from './csrf.actions';
import { CsrfEffects } from './csrf.effects';
import { initialCsrfState } from './csrf.reducer';

describe('CsrfEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: CsrfEffects;
  let service: CsrfService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { csrf: initialCsrfState } }),
        provideMockActions(() => actions$),
        CsrfEffects,
        {
          provide: CsrfService,
          useValue: createMock<CsrfService>({
            createToken: jest.fn().mockReturnValue(of(testBaseCsrfTokenDto1)),
          }),
        },
      ],
    });

    effects = TestBed.inject(CsrfEffects);
    service = TestBed.inject(CsrfService);
    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('getCsrfToken$', () => {
    it('should fire getCsrfTokenSuccess if successful', () => {
      actions$ = hot('a', { a: CsrfActions.getCsrfToken() });
      const expected$ = hot('a', {
        a: CsrfActions.getCsrfTokenSuccess({
          csrfTokenDto: testBaseCsrfTokenDto1,
        }),
      });
      expect(effects.getCsrfToken$).toBeObservable(expected$);
    });

    it('should not fire if CSRF token is already set', () => {
      store.setState({
        csrf: {
          ...initialCsrfState,
          csrfToken: testBaseCsrfTokenDto1.csrfToken,
        },
      });
      actions$ = hot('a', { a: CsrfActions.getCsrfToken() });
      const expected$ = hot('-');
      expect(effects.getCsrfToken$).toBeObservable(expected$);
    });
  });
});
