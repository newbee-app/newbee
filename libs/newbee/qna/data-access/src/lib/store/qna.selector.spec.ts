import { TestBed } from '@angular/core/testing';
import {
  OrganizationState,
  initialHttpState,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testQna1,
  testQnaRelation1,
  testTeam1,
  testTeam2,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectQnaAndOrg,
  selectQnaAndOrgStates,
  selectQnaAndScreenError,
  selectQnaTeams,
} from './qna.selector';

describe('QnaSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Qna]: initialQnaState,
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectQnaTeams', () => {
    it('should handle if org state and selectedQna are not defined', () => {
      const expected$ = hot('a', { a: [] });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);
    });

    it('should allow all org teams if there is no selectedQna, the qna has not been answered yet, or the org member is a moderator', () => {
      const orgState: OrganizationState = {
        ...initialOrganizationState,
        selectedOrganization: testOrganizationRelation1,
        orgMember: { ...testOrgMemberRelation1, teams: [] },
      };
      store.setState({ [Keyword.Organization]: orgState });
      const expected$ = hot('a', { a: testOrganizationRelation1.teams });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);

      store.setState({
        [Keyword.Organization]: orgState,
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: {
            ...testQnaRelation1,
            qna: { ...testQna1, answerMarkdoc: null, answerHtml: null },
          },
        },
      });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);

      store.setState({
        [Keyword.Organization]: orgState,
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: testQnaRelation1,
        },
      });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);
    });

    it('should allow org member teams + qna team if org member is just a member, the selectedQna has been answered, and has a team', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: { ...testOrganizationRelation1, teams: [] },
          orgMember: {
            ...testOrgMemberRelation1,
            orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
          },
        },
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: {
            ...testQnaRelation1,
            team: testTeam2,
          },
        },
      });
      const expected$ = hot('a', {
        a: [testTeam2, testTeam1],
      });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);
    });

    it('should allow only org member teams if the org member is just a member, the selectedQna has been answered, and has no team', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: { ...testOrganizationRelation1, teams: [] },
          orgMember: {
            ...testOrgMemberRelation1,
            orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
          },
        },
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: { ...testQnaRelation1, team: null },
        },
      });
      const expected$ = hot('a', {
        a: testOrgMemberRelation1.teams.map((team) => team.team),
      });
      expect(store.select(selectQnaTeams)).toBeObservable(expected$);
    });
  });

  describe('selectQnaAndOrg', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { selectedQna: null, selectedOrganization: null },
      });
      expect(store.select(selectQnaAndOrg)).toBeObservable(expected$);
    });

    it('should return currently selected qna and org', () => {
      store.setState({
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: testQnaRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedQna: testQnaRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectQnaAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectQnaAndScreenError', () => {
    it('should select qna and screen error', () => {
      store.setState({
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: testQnaRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedQna: testQnaRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectQnaAndScreenError)).toBeObservable(expected$);
    });
  });

  describe('selectQnaAndOrgStates', () => {
    it('should select qna and org states', () => {
      const expected$ = hot('a', {
        a: { qnaState: initialQnaState, orgState: initialOrganizationState },
      });
      expect(store.select(selectQnaAndOrgStates)).toBeObservable(expected$);
    });
  });
});