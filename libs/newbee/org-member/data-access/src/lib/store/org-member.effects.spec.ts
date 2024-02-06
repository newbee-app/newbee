import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  initialHttpState,
  initialOrganizationState,
  initialOrgMemberState,
  OrgMemberActions,
  ToastActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  ShortUrl,
  testHttpClientError1,
  Toast,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateOrgMemberInviteDto1,
  testBaseGetOrgMemberPostsDto1,
  testBaseUpdateOrgMemberDto1,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
  testUser1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { v4 } from 'uuid';
import { OrgMemberService } from '../org-member.service';
import { OrgMemberEffects } from './org-member.effects';
import { initialOrgMemberState as initialOrgMemberModuleState } from './org-member.reducer';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

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
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Member]: {
              ...initialOrgMemberState,
              selectedOrgMember: testOrgMemberRelation1,
            },
            [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
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
            getAllDocs: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsDocQueryResult1)),
            getAllQnas: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsQnaQueryResult1)),
            inviteUser: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(OrgMemberEffects);
    service = TestBed.inject(OrgMemberService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');

    jest.clearAllMocks();
    mockV4.mockReturnValue('1');
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

  describe('getDocs$', () => {
    it(`should fire getDocsPending if this is the first request, selected organization and selected org member are set, and there's no error`, () => {
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getDocsPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should fire getDocsPending if this is a follow-up request, selected organization and slected org member are set, there are more results to fetch, and there's no error`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          docs: {
            ...testPaginatedResultsDocQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getDocsPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it('should do nothing if there are no more results to fetch', () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          docs: testPaginatedResultsDocQueryResult1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should do nothing if selectedOrgMember isn't set`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: initialOrgMemberState,
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should do nothing if there's an error`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocs({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });
  });

  describe('getDocsPending$', () => {
    it('should fire getDocsSuccess if this is the first request', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.getDocsPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      });
      expect(effects.getDocsPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).toHaveBeenCalledTimes(1);
        expect(service.getAllDocs).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseGetOrgMemberPostsDto1,
        );
      });
    });

    it('should fire getDocsSuccess if this is a follow-up request', () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          docs: {
            ...testPaginatedResultsDocQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getDocsPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      });
      expect(effects.getDocsPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).toHaveBeenCalledTimes(1);
        expect(service.getAllDocs).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
          {
            ...testBaseGetOrgMemberPostsDto1,
            offset: 1,
          },
        );
      });
    });
  });

  describe('getQnas$', () => {
    it(`should fire getQnasPending if this is the first request, selected organization and selected org member are set, and there's no error`, () => {
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getQnasPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
    });

    it(`should fire getQnasPending if this is a follow-up request, selected organization and slected org member are set, there are more results to fetch, and there's no error`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          qnas: {
            ...testPaginatedResultsQnaQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getQnasPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
    });

    it('should do nothing if there are no more results to fetch', () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          qnas: testPaginatedResultsQnaQueryResult1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
    });

    it(`should do nothing if selectedOrgMember isn't set`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: initialOrgMemberState,
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
    });

    it(`should do nothing if there's an error`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: initialOrgMemberModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnas({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
    });
  });

  describe('getQnasPending$', () => {
    it('should fire getQnasSuccess if this is the first request', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.getQnasPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnasPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).toHaveBeenCalledTimes(1);
        expect(service.getAllQnas).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseGetOrgMemberPostsDto1,
        );
      });
    });

    it('should fire getQnasSuccess if this is a follow-up request', () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          qnas: {
            ...testPaginatedResultsQnaQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: OrgMemberActions.getQnasPending({
          role: testBaseGetOrgMemberPostsDto1.role ?? null,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnasPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).toHaveBeenCalledTimes(1);
        expect(service.getAllQnas).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOrgMember1.slug,
          {
            ...testBaseGetOrgMemberPostsDto1,
            offset: 1,
          },
        );
      });
    });
  });

  describe('inviteUser$', () => {
    it('should fire inviteUserSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      });
      const expected$ = hot('a', {
        a: OrgMemberActions.inviteUserSuccess({
          email: testBaseCreateOrgMemberInviteDto1.email,
        }),
      });
      expect(effects.inviteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.inviteUser).toHaveBeenCalledTimes(1);
        expect(service.inviteUser).toHaveBeenCalledWith(
          testOrganization1.slug,
          testBaseCreateOrgMemberInviteDto1,
        );
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      store.setState({});
      actions$ = hot('a', {
        a: OrgMemberActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.inviteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.inviteUser).not.toHaveBeenCalled();
      });
    });
  });

  describe('inviteUserSuccess$', () => {
    it('should fire addToast if successful', () => {
      actions$ = hot('a', {
        a: OrgMemberActions.inviteUserSuccess({
          email: testUser1.email,
        }),
      });
      const expected$ = hot('a', {
        a: ToastActions.addToast({
          toast: new Toast(
            'Your invitation has been sent!',
            `An invitation was successfully sent to ${testUser1.email} to join your org.`,
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            null,
          ),
        }),
      });
      expect(effects.inviteUserSuccess$).toBeObservable(expected$);
    });
  });
});
