import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { testMagicLinkLoginLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthEffects } from './auth.effects';
import { AuthService } from './auth.service';

describe('AuthEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthEffects;
  let service: AuthService;
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            login: jest.fn().mockReturnValue(of(testMagicLinkLoginDto1)),
          }),
        },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('sendMagicLink$', () => {
    it('should fire when the sendMagicLink action is dispatched', () => {
      testScheduler.run(({ hot, expectObservable, flush }) => {
        actions$ = hot('a', {
          a: AuthActions.sendMagicLink(testMagicLinkLoginLoginForm1),
        });
        expectObservable(effects.sendMagicLink$).toBe('a', {
          a: AuthActions.sendMagicLinkSuccess(testMagicLinkLoginDto1),
        });

        flush();
        expect(service.login).toBeCalledTimes(1);
        expect(service.login).toBeCalledWith(testMagicLinkLoginLoginForm1);
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      testScheduler.run(({ hot, expectObservable, flush }) => {
        actions$ = hot('a', { a: { type: 'Unknown' } });
        expectObservable(effects.sendMagicLink$).toBe('-');

        flush();
        expect(service.login).not.toBeCalled();
      });
    });
  });
});
