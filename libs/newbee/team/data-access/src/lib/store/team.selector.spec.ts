import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgMemberUser,
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
  testOrganizationRelation1,
  testPaginatedResultsDocSearchResult1,
  testPaginatedResultsQnaSearchResult1,
  testTeamRelation1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialTeamState as initialTeamModuleState } from './team.reducer';
import {
  selectNonTeamOrgMembers,
  selectTeamAndOrg,
  selectTeamAndOrgStates,
  selectTeamAndScreenError,
  selectTeamPostsOrgAndError,
} from './team.selector';

describe('TeamSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [`${Keyword.Team}Module`]: initialTeamModuleState,
            [Keyword.Team]: initialTeamState,
            [Keyword.Organization]: initialOrganizationState,
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectTeamAndOrg', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { selectedTeam: null, selectedOrganization: null },
      });
      expect(store.select(selectTeamAndOrg)).toBeObservable(expected$);
    });

    it('should return currently selected team and org', () => {
      store.setState({
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedTeam: testTeamRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectTeamAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectTeamAndScreenError', () => {
    it('should select team and screen error', () => {
      store.setState({
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedTeam: testTeamRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectTeamAndScreenError)).toBeObservable(expected$);
    });
  });

  describe('selectTeamAndOrgStates', () => {
    it('should select team and org states', () => {
      store.setState({
        [Keyword.Team]: initialTeamState,
        [Keyword.Organization]: initialOrganizationState,
      });
      const expected$ = hot('a', {
        a: {
          teamState: initialTeamState,
          orgState: initialOrganizationState,
        },
      });
      expect(store.select(selectTeamAndOrgStates)).toBeObservable(expected$);
    });
  });

  describe('selectNonTeamOrgMembers', () => {
    it('should select all of the org members who are not in the team', () => {
      const testOrgMemberUser3: OrgMemberUser = {
        orgMember: {
          ...testOrgMember1,
          slug: 'different',
          role: OrgRoleEnum.Member,
        },
        user: testUser1,
      };
      store.setState({
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: {
            ...testOrganizationRelation1,
            members: [
              testOrgMemberUser1,
              testOrgMemberUser2,
              testOrgMemberUser3,
            ],
          },
        },
      });
      const expected$ = hot('a', { a: [testOrgMemberUser3] });
      expect(store.select(selectNonTeamOrgMembers)).toBeObservable(expected$);
    });
  });

  describe('selectTeamPostsOrgAndError', () => {
    it(`should select the team's posts, selected team, selected org, and error`, () => {
      store.setState({
        [`${Keyword.Team}Module`]: {
          ...initialTeamModuleState,
          docs: testPaginatedResultsDocSearchResult1,
          qnas: testPaginatedResultsQnaSearchResult1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      const expected$ = hot('a', {
        a: {
          docs: testPaginatedResultsDocSearchResult1,
          qnas: testPaginatedResultsQnaSearchResult1,
          selectedTeam: testTeamRelation1,
          selectedOrganization: testOrganizationRelation1,
          error: testHttpClientError1,
        },
      });
      expect(store.select(selectTeamPostsOrgAndError)).toBeObservable(
        expected$,
      );
    });
  });
});
