import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  initialOrganizationState,
  initialOrgMemberState,
  OrgMemberActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseUpdateOrgMemberDto1,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { OrgMemberService } from '../org-member.service';
import { OrgMemberEffects } from './org-member.effects';

describe('OrgMemberEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: OrgMemberEffects;
  let service: OrgMemberService;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Member]: {
              ...initialOrgMemberState,
              selectedOrgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        OrgMemberEffects,
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            get: jest.fn().mockReturnValue(of(testOrgMemberRelation1)),
            edit: jest.fn().mockReturnValue(of(testOrgMember1)),
            delete: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(OrgMemberEffects);
    service = TestBed.inject(OrgMemberService);
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

  describe('getOrgMember$', () => {
    it('should fire getOrgMemberSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.getOrgMember({ slug: testOrgMember1.slug }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getOrgMemberSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      expect(effects.getOrgMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toHaveBeenCalledTimes(1);
        expect(service.get).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
        );
      });
    });
  });

  describe('editOrgMember$', () => {
    it('should fire editOrgMemberSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.editOrgMember({
          updateOrgMemberDto: testBaseUpdateOrgMemberDto1,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.editOrgMemberSuccess({ orgMember: testOrgMember1 }),
      });
      expect(effects.editOrgMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseUpdateOrgMemberDto1,
        );
      });
    });
  });

  describe('deleteOrgMember$', () => {
    it('should fire deleteOrgMemberSuccess if successful', () => {
      actions$ = hot('a', { a: OrgMemberActions.deleteOrgMember() });
      const expected$ = hot('a', {
        a: OrgMemberActions.deleteOrgMemberSuccess(),
      });
      expect(effects.deleteOrgMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
        );
      });
    });
  });

  describe('deleteOrgMemberSuccess$', () => {
    it('should navigate to org', () => {
      actions$ = hot('a', { a: OrgMemberActions.deleteOrgMemberSuccess() });
      const expected$ = hot('a', {
        a: [
          OrgMemberActions.deleteOrgMemberSuccess(),
          testOrganizationRelation1,
        ],
      });
      expect(effects.deleteOrgMemberSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}`,
        ]);
      });
    });

    it('should navigate to home if selected org is not set', () => {
      store.setState({ [Keyword.Organization]: initialOrganizationState });
      actions$ = hot('a', { a: OrgMemberActions.deleteOrgMemberSuccess() });
      const expected$ = hot('a', {
        a: [OrgMemberActions.deleteOrgMemberSuccess(), null],
      });
      expect(effects.deleteOrgMemberSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });
});
