import { TestBed } from '@angular/core/testing';
import {
  initialDocState,
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  testDocRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testTeam1,
  testTeam2,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectDocAndOrg,
  selectDocAndOrgStates,
  selectDocAndScreenError,
  selectDocTeams,
} from './doc.selector';

describe('DocSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Doc]: initialDocState,
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectDocTeams', () => {
    it('should handle if org state and selectedDoc are not defined', () => {
      const expected$ = hot('a', { a: [] });
      expect(store.select(selectDocTeams)).toBeObservable(expected$);
    });

    it('should allow all org teams if the org member is a moderator', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
          orgMember: { ...testOrgMemberRelation1, teams: [] },
        },
        [Keyword.Doc]: initialDocState,
      });
      const expected$ = hot('a', { a: testOrganizationRelation1.teams });
      expect(store.select(selectDocTeams)).toBeObservable(expected$);
    });

    it('should allow org member teams + doc team if org member is just a member and the selectedDoc has a team', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
          orgMember: {
            ...testOrgMemberRelation1,
            orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
          },
        },
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: {
            ...testDocRelation1,
            team: testTeam2,
          },
        },
      });
      const expected$ = hot('a', { a: [testTeam2, testTeam1] });
      expect(store.select(selectDocTeams)).toBeObservable(expected$);
    });

    it('should only allow org member teams if the org member is just a member and the selectedDoc has no team', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: { ...testOrganizationRelation1, teams: [] },
          orgMember: {
            ...testOrgMemberRelation1,
            orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
          },
        },
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: {
            ...testDocRelation1,
            team: null,
          },
        },
      });
      const expected$ = hot('a', {
        a: testOrgMemberRelation1.teams.map((team) => team.team),
      });
      expect(store.select(selectDocTeams)).toBeObservable(expected$);
    });
  });

  describe('selectDocAndOrg', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { selectedDoc: null, selectedOrganization: null },
      });
      expect(store.select(selectDocAndOrg)).toBeObservable(expected$);
    });

    it('should return currently selected doc and org', () => {
      store.setState({
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: testDocRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedDoc: testDocRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectDocAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectDocAndScreenError', () => {
    it('should return doc and screen error', () => {
      store.setState({
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: testDocRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedDoc: testDocRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectDocAndScreenError)).toBeObservable(expected$);
    });
  });

  describe('selectDocAndOrgStates', () => {
    it('should return doc and org states', () => {
      const expected$ = hot('a', {
        a: { orgState: initialOrganizationState, docState: initialDocState },
      });
      expect(store.select(selectDocAndOrgStates)).toBeObservable(expected$);
    });
  });
});
