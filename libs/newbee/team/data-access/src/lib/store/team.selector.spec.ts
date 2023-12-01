import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganizationRelation1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectTeamAndOrg,
  selectTeamAndOrgStates,
  selectTeamAndScreenError,
} from './team.selector';

describe('TeamSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
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
});
