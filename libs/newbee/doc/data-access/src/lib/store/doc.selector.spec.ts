import { TestBed } from '@angular/core/testing';
import {
  initialDocstate,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
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
import { selectDocTeams } from './doc.selector';

describe('DocSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Doc]: initialDocstate,
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
        [Keyword.Doc]: initialDocstate,
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
          ...initialDocstate,
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
          ...initialDocstate,
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
});
