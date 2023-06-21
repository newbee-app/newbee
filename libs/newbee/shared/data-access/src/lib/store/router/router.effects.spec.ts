import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { RouterActions } from './router.actions';
import { RouterEffects } from './router.effects';

describe('RouterEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: RouterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        RouterEffects,
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(RouterEffects);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
  });

  describe('routerRequest$', () => {
    it('should fire routerRequest', () => {
      actions$ = hot('a', { a: { type: ROUTER_REQUEST } });
      const expected$ = hot('a', { a: RouterActions.routerRequest() });
      expect(effects.routerRequest$).toBeObservable(expected$);
    });
  });
});
