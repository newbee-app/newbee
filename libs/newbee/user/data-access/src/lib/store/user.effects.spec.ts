import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { UserActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testBaseUpdateUserDto1, testUser1 } from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { UserService } from '../user.service';
import { UserEffects } from './user.effects';

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
        provideMockStore(),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        UserEffects,
        {
          provide: UserService,
          useValue: createMock<UserService>({
            edit: jest.fn().mockReturnValue(of(testUser1)),
            delete: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(UserEffects);
    service = TestBed.inject(UserService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
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
        a: UserActions.editUser({ updateUserDto: testBaseUpdateUserDto1 }),
      });
      const expected$ = hot('a', {
        a: UserActions.editUserSuccess({ user: testUser1 }),
      });
      expect(effects.editUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(testBaseUpdateUserDto1);
      });
    });
  });

  describe('deleteUser$', () => {
    it('should fire deleteUserSuccess if successful', () => {
      actions$ = hot('a', { a: UserActions.deleteUser() });
      const expected$ = hot('a', { a: UserActions.deleteUserSuccess() });
      expect(effects.deleteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith();
      });
    });
  });

  describe('deleteUserSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', { a: UserActions.deleteUserSuccess() });
      const expected$ = hot('a', { a: UserActions.deleteUserSuccess() });
      expect(effects.deleteUserSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });
  });
});
