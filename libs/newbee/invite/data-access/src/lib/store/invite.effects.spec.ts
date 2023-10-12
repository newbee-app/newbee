import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testBaseTokenDto1 } from '@newbee/shared/data-access';
import { testOrgMemberRelation1 } from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { InviteService } from '../invite.service';
import { InviteEffects } from './invite.effects';

describe('InviteEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: InviteEffects;
  let service: InviteService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        InviteEffects,
        {
          provide: InviteService,
          useValue: createMock<InviteService>({
            acceptInvite: jest.fn().mockReturnValue(of(testOrgMemberRelation1)),
            declineInvite: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(InviteEffects);
    service = TestBed.inject(InviteService);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('acceptInvite$', () => {
    it('should fire acceptInviteSuccess if successful', () => {
      actions$ = hot('a', {
        a: InviteActions.acceptInvite({ tokenDto: testBaseTokenDto1 }),
      });
      const expected$ = hot('a', {
        a: InviteActions.acceptInviteSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      expect(effects.acceptInvite$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.acceptInvite).toBeCalledTimes(1);
        expect(service.acceptInvite).toBeCalledWith(testBaseTokenDto1);
      });
    });
  });

  describe('declineInvite$', () => {
    it('should fire declineInviteSuccess if successful', () => {
      actions$ = hot('a', {
        a: InviteActions.declineInvite({ tokenDto: testBaseTokenDto1 }),
      });
      const expected$ = hot('a', { a: InviteActions.declineInviteSuccess() });
      expect(effects.declineInvite$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.declineInvite).toBeCalledTimes(1);
        expect(service.declineInvite).toBeCalledWith(testBaseTokenDto1);
      });
    });
  });

  describe('inviteSuccess$', () => {
    it('should navigate to home for acceptInviteSuccess', () => {
      actions$ = hot('a', {
        a: InviteActions.acceptInviteSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      const expected$ = hot('a', {
        a: InviteActions.acceptInviteSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      expect(effects.inviteSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });

    it('should navigate to home for declineInviteSuccess', () => {
      actions$ = hot('a', { a: InviteActions.declineInviteSuccess() });
      const expected$ = hot('a', { a: InviteActions.declineInviteSuccess() });
      expect(effects.inviteSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });
  });
});
