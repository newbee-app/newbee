import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  ToastActions,
  UserActions,
  initialAuthState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  Toast,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseTokenDto1,
  testUpdateUserDto1,
  testUser1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { v4 } from 'uuid';
import { UserService } from '../user.service';
import { UserEffects } from './user.effects';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('UserEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: UserEffects;
  let service: UserService;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            [Keyword.Auth]: { ...initialAuthState, [Keyword.User]: testUser1 },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        UserEffects,
        {
          provide: UserService,
          useValue: createMock<UserService>({
            edit: jest.fn().mockReturnValue(of(testUser1)),
            delete: jest.fn().mockReturnValue(of(null)),
            verifyEmail: jest.fn().mockReturnValue(of(testUser1)),
            sendVerificationEmail: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(UserEffects);
    service = TestBed.inject(UserService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.clearAllMocks();
    jest.spyOn(router, 'navigate');
    mockV4.mockReturnValue('1');
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('editUser$', () => {
    it('should fire editUserSuccess if successful', () => {
      actions$ = hot('a', {
        a: UserActions.editUser({ updateUserDto: testUpdateUserDto1 }),
      });
      const expected$ = hot('a', {
        a: UserActions.editUserSuccess({ user: testUser1 }),
      });
      expect(effects.editUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(testUpdateUserDto1);
      });
    });
  });

  describe('deleteUser$', () => {
    it('should fire deleteUserSuccess if successful', () => {
      actions$ = hot('a', { a: UserActions.deleteUser() });
      const expected$ = hot('a', { a: UserActions.deleteUserSuccess() });
      expect(effects.deleteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith();
      });
    });
  });

  describe('deleteUserSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', { a: UserActions.deleteUserSuccess() });
      const expected$ = hot('a', { a: UserActions.deleteUserSuccess() });
      expect(effects.deleteUserSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('verifyEmail$', () => {
    it('should fire verifyEmailSuccess if successful', () => {
      actions$ = hot('a', {
        a: UserActions.verifyEmail({ token: testBaseTokenDto1.token }),
      });
      const expected$ = hot('a', {
        a: UserActions.verifyEmailSuccess({ user: testUser1 }),
      });
      expect(effects.verifyEmail$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.verifyEmail).toHaveBeenCalledTimes(1);
        expect(service.verifyEmail).toHaveBeenCalledWith(
          testBaseTokenDto1.token,
        );
      });
    });
  });

  describe('verifyEmailSuccess$', () => {
    it('should fire addToast and navigate the user to the homepage', () => {
      actions$ = hot('a', {
        a: UserActions.verifyEmailSuccess({ user: testUser1 }),
      });
      const expected$ = hot('a', {
        a: ToastActions.addToast({
          toast: new Toast(
            `Successfully verified ${testUser1.email}`,
            '',
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            null,
          ),
        }),
      });
      expect(effects.verifyEmailSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('sendVerificationEmail$', () => {
    it('should fire sendVerificationEmailSuccess if successful', () => {
      actions$ = hot('a', { a: UserActions.sendVerificationEmail() });
      const expected$ = hot('a', {
        a: UserActions.sendVerificationEmailSuccess(),
      });
      expect(effects.sendVerificationEmail$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.sendVerificationEmail).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('sendVerificationEmailSuccess$', () => {
    it('should fire addToast if successful', () => {
      actions$ = hot('a', { a: UserActions.sendVerificationEmailSuccess() });
      const expected$ = hot('a', {
        a: ToastActions.addToast({
          toast: new Toast(
            `Successfully sent verification email to ${testUser1.email}`,
            'Please check your inbox',
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            null,
          ),
        }),
      });
      expect(effects.sendVerificationEmailSuccess$).toBeObservable(expected$);
    });
  });
});
