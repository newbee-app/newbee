import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  initialOrganizationState,
  initialTeamState,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateTeamDto1,
  testBaseCreateTeamMemberDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  testBaseTeamAndMemberDto1,
  testBaseUpdateTeamDto1,
  testBaseUpdateTeamMemberDto1,
  testOffsetAndLimit1,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMember1,
  testOrgMember2,
  testOrgMemberRelation1,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
  testTeam1,
  testTeamMember1,
  testTeamMemberRelation1,
  testTeamMemberRelation2,
  testTeamRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { TeamService } from '../team.service';
import { TeamEffects } from './team.effects';
import { initialTeamState as initialTeamModuleState } from './team.reducer';

describe('TeamEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: TeamEffects;
  let service: TeamService;
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
              orgMember: testOrgMemberRelation1,
            },
            [Keyword.Team]: {
              ...initialTeamState,
              selectedTeam: testTeamRelation1,
            },
            [`${Keyword.Team}Module`]: initialTeamModuleState,
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        TeamEffects,
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            get: jest.fn().mockReturnValue(of(testBaseTeamAndMemberDto1)),
            create: jest.fn().mockReturnValue(of(testTeam1)),
            edit: jest.fn().mockReturnValue(of(testTeam1)),
            delete: jest.fn().mockReturnValue(of(null)),
            checkSlug: jest.fn().mockReturnValue(of(testBaseSlugTakenDto1)),
            generateSlug: jest
              .fn()
              .mockReturnValue(of(testBaseGeneratedSlugDto1)),
            getAllDocs: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsDocQueryResult1)),
            getAllQnas: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsQnaQueryResult1)),
            createTeamMember: jest
              .fn()
              .mockReturnValue(of(testTeamMemberRelation1)),
            editTeamMember: jest.fn().mockReturnValue(of(testTeamMember1)),
            deleteTeamMember: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(TeamEffects);
    service = TestBed.inject(TeamService);
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

  describe('getTeam$', () => {
    it('should fire getTeamSuccess if successful', () => {
      actions$ = hot('a', { a: TeamActions.getTeam({ slug: testTeam1.slug }) });
      const expected$ = hot('a', {
        a: TeamActions.getTeamSuccess({
          teamAndMemberDto: testBaseTeamAndMemberDto1,
        }),
      });
      expect(effects.getTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toHaveBeenCalledTimes(1);
        expect(service.get).toHaveBeenCalledWith(
          testTeam1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', { a: TeamActions.getTeam({ slug: testTeam1.slug }) });
      const expected$ = hot('-');
      expect(effects.getTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).not.toHaveBeenCalled();
      });
    });
  });

  describe('createTeam$', () => {
    it('should fire createTeamSuccess if successful', () => {
      actions$ = hot('a', {
        a: TeamActions.createTeam({ createTeamDto: testBaseCreateTeamDto1 }),
      });
      const expected$ = hot('a', {
        a: TeamActions.createTeamSuccess({
          organization: testOrganization1,
          team: testTeam1,
        }),
      });
      expect(effects.createTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(service.create).toHaveBeenCalledWith(
          testBaseCreateTeamDto1,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: TeamActions.createTeam({ createTeamDto: testBaseCreateTeamDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.createTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('createTeamSuccess$', () => {
    it('should navigate to team', () => {
      actions$ = hot('a', {
        a: TeamActions.createTeamSuccess({
          organization: testOrganization1,
          team: testTeam1,
        }),
      });
      const expected$ = hot('a', {
        a: [
          TeamActions.createTeamSuccess({
            organization: testOrganization1,
            team: testTeam1,
          }),
          testOrganizationRelation1,
        ],
      });
      expect(effects.createTeamSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}`,
        ]);
      });
    });
  });

  describe('editTeam$', () => {
    it('should fire editTeamSuccess if successful for editTeam', () => {
      actions$ = hot('a', {
        a: TeamActions.editTeam({ updateTeamDto: testBaseUpdateTeamDto1 }),
      });
      const expected$ = hot('a', {
        a: TeamActions.editTeamSuccess({
          oldSlug: testTeam1.slug,
          newTeam: testTeam1,
        }),
      });
      expect(effects.editTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testBaseUpdateTeamDto1,
        );
      });
    });

    it('should fire editTeamSlugSuccess if successful for editTeamSlug', () => {
      actions$ = hot('a', {
        a: TeamActions.editTeamSlug({ updateTeamDto: testBaseUpdateTeamDto1 }),
      });
      const expected$ = hot('a', {
        a: TeamActions.editTeamSlugSuccess({
          oldSlug: testTeam1.slug,
          newTeam: testTeam1,
        }),
      });
      expect(effects.editTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testBaseUpdateTeamDto1,
        );
      });
    });

    it('should do nothing if selectedOrganization or selectedTeam is null', () => {
      store.setState({});
      actions$ = hot('a', {
        a: TeamActions.editTeam({ updateTeamDto: testBaseUpdateTeamDto1 }),
      });
      const expected$ = hot('-');
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toHaveBeenCalled();
      });
    });
  });

  describe('editTeamSlugSuccess$', () => {
    it('should navigate to team edit', () => {
      actions$ = hot('a', {
        a: TeamActions.editTeamSlugSuccess({
          oldSlug: testTeam1.slug,
          newTeam: testTeam1,
        }),
      });
      const expected$ = hot('a', {
        a: [
          TeamActions.editTeamSlugSuccess({
            oldSlug: testTeam1.slug,
            newTeam: testTeam1,
          }),
          testOrganizationRelation1,
        ],
      });
      expect(effects.editTeamSlugSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}/${Keyword.Edit}`,
        ]);
      });
    });
  });

  describe('deleteTeam$', () => {
    it('should fire deleteTeamSuccess if successful', () => {
      actions$ = hot('a', { a: TeamActions.deleteTeam() });
      const expected$ = hot('a', {
        a: TeamActions.deleteTeamSuccess({ slug: testTeam1.slug }),
      });
      expect(effects.deleteTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
        );
      });
    });

    it('should do nothing if selectedOrganization or selectedTeam is null', () => {
      store.setState({});
      actions$ = hot('a', { a: TeamActions.deleteTeam() });
      const expected$ = hot('-');
      expect(effects.deleteTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteTeamSuccess$', () => {
    it('should navigate to org', () => {
      actions$ = hot('a', {
        a: TeamActions.deleteTeamSuccess({ slug: testTeam1.slug }),
      });
      const expected$ = hot('a', {
        a: [
          TeamActions.deleteTeamSuccess({ slug: testTeam1.slug }),
          testOrganizationRelation1,
        ],
      });
      expect(effects.deleteTeamSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}`,
        ]);
      });
    });

    it('should navigate home if selected org is not set', () => {
      store.setState({ [Keyword.Organization]: initialOrganizationState });
      actions$ = hot('a', {
        a: TeamActions.deleteTeamSuccess({ slug: testTeam1.slug }),
      });
      const expected$ = hot('a', {
        a: [TeamActions.deleteTeamSuccess({ slug: testTeam1.slug }), null],
      });
      expect(effects.deleteTeamSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('checkSlug$', () => {
    it('should fire checkSlugSuccess if successful', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      actions$ = hot('a', {
        a: TeamActions.checkSlug({ slug: testTeam1.slug }),
      });
      const expected$ = hot('a', {
        a: TeamActions.checkSlugSuccess({
          slugTaken: testBaseSlugTakenDto1.slugTaken,
        }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).toHaveBeenCalledTimes(1);
        expect(service.checkSlug).toHaveBeenCalledWith(
          testTeam1.slug,
          testOrganization1.slug,
        );
      });
    });

    it('should fire checkSlugSuccess with slugTaken as false if slug is the same as selectedTeam', () => {
      actions$ = hot('a', {
        a: TeamActions.checkSlug({ slug: testTeamRelation1.team.slug }),
      });
      const expected$ = hot('a', {
        a: TeamActions.checkSlugSuccess({ slugTaken: false }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toHaveBeenCalled();
      });
    });

    it('should do nothing if slug is an empty string', () => {
      actions$ = hot('a', { a: TeamActions.checkSlug({ slug: '' }) });
      const expected$ = hot('-');
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: TeamActions.checkSlug({ slug: testTeam1.slug }),
      });
      const expected$ = hot('-');
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toHaveBeenCalled();
      });
    });
  });

  describe('generateSlug$', () => {
    it('should fire generateSlugSuccess if successful', () => {
      actions$ = hot('a', {
        a: TeamActions.generateSlug({ name: testTeam1.name }),
      });
      const expected$ = hot('a', {
        a: TeamActions.generateSlugSuccess({
          slug: testBaseGeneratedSlugDto1.generatedSlug,
        }),
      });
      expect(effects.generateSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.generateSlug).toHaveBeenCalledTimes(1);
        expect(service.generateSlug).toHaveBeenCalledWith(
          testTeam1.name,
          testOrganization1.slug,
        );
      });
    });

    it('should do nothing if name is an empty string', () => {
      actions$ = hot('a', {
        a: TeamActions.generateSlug({ name: '' }),
      });
      const expected$ = hot('-');
      expect(effects.generateSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.generateSlug).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: TeamActions.generateSlug({ name: testTeam1.name }),
      });
      const expected$ = hot('-');
      expect(effects.generateSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.generateSlug).not.toHaveBeenCalled();
      });
    });
  });

  describe('getDocs$', () => {
    it('should fire getDocsSuccess if this is the first request and selected organization and selected team is set', () => {
      actions$ = hot('a', {
        a: TeamActions.getDocs(),
      });
      const expected$ = hot('a', {
        a: TeamActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      });
      expect(effects.getDocs$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).toHaveBeenCalledTimes(1);
        expect(service.getAllDocs).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testOffsetAndLimit1,
        );
      });
    });

    it('should fire getDocsSuccess if this is a follow-up request, selected organization and slected team is set, and there are more results to fetch', () => {
      store.setState({
        [`${Keyword.Team}Module`]: {
          ...initialTeamModuleState,
          docs: {
            ...testPaginatedResultsDocQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', {
        a: TeamActions.getDocs(),
      });
      const expected$ = hot('a', {
        a: TeamActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      });
      expect(effects.getDocs$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).toHaveBeenCalledTimes(1);
        expect(service.getAllDocs).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          {
            ...testOffsetAndLimit1,
            offset: 1,
          },
        );
      });
    });

    it('should fire getDocsSuccess with the same docs if there are no more results to fetch', () => {
      store.setState({
        [`${Keyword.Team}Module`]: {
          ...initialTeamModuleState,
          docs: testPaginatedResultsDocQueryResult1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', { a: TeamActions.getDocs() });
      const expected$ = hot('a', {
        a: TeamActions.getDocsSuccess({
          docs: testPaginatedResultsDocQueryResult1,
        }),
      });
      expect(effects.getDocs$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({
        [`${Keyword.Team}Module`]: initialTeamModuleState,
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', {
        a: TeamActions.getDocs(),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedTeam isn't set`, () => {
      store.setState({
        [`${Keyword.Team}Module`]: initialTeamModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: initialTeamState,
      });
      actions$ = hot('a', {
        a: TeamActions.getDocs(),
      });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllDocs).not.toHaveBeenCalled();
      });
    });
  });

  describe('getQnas$', () => {
    it('should fire getQnasSuccess if this is the first request and selected organization and selected team is set', () => {
      actions$ = hot('a', {
        a: TeamActions.getQnas(),
      });
      const expected$ = hot('a', {
        a: TeamActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).toHaveBeenCalledTimes(1);
        expect(service.getAllQnas).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testOffsetAndLimit1,
        );
      });
    });

    it('should fire getQnasSuccess if this is a follow-up request, selected organization and slected team is set, and there are more results to fetch', () => {
      store.setState({
        [`${Keyword.Team}Module`]: {
          ...initialTeamModuleState,
          qnas: {
            ...testPaginatedResultsQnaQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', {
        a: TeamActions.getQnas(),
      });
      const expected$ = hot('a', {
        a: TeamActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).toHaveBeenCalledTimes(1);
        expect(service.getAllQnas).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          {
            ...testOffsetAndLimit1,
            offset: 1,
          },
        );
      });
    });

    it('should fire getQnasSuccess with same qnas if there are no more results to fetch', () => {
      store.setState({
        [`${Keyword.Team}Module`]: {
          ...initialTeamModuleState,
          qnas: testPaginatedResultsQnaQueryResult1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', { a: TeamActions.getQnas() });
      const expected$ = hot('a', {
        a: TeamActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({
        [`${Keyword.Team}Module`]: initialTeamModuleState,
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: {
          ...initialTeamState,
          selectedTeam: testTeamRelation1,
        },
      });
      actions$ = hot('a', {
        a: TeamActions.getQnas(),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedTeam isn't set`, () => {
      store.setState({
        [`${Keyword.Team}Module`]: initialTeamModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Team]: initialTeamState,
      });
      actions$ = hot('a', {
        a: TeamActions.getQnas(),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllQnas).not.toHaveBeenCalled();
      });
    });
  });

  describe('addTeamMember$', () => {
    it('should fire addTeamMemberSuccess if successful', () => {
      jest
        .spyOn(service, 'createTeamMember')
        .mockReturnValue(of(testTeamMemberRelation2));
      actions$ = hot('a', {
        a: TeamActions.addTeamMember({
          createTeamMemberDto: testBaseCreateTeamMemberDto1,
        }),
      });
      const expected$ = hot('a', {
        a: TeamActions.addTeamMemberSuccess({
          teamMember: testTeamMemberRelation2,
        }),
      });
      expect(effects.addTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createTeamMember).toHaveBeenCalledTimes(1);
        expect(service.createTeamMember).toHaveBeenCalledWith(
          testBaseCreateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
        );
      });
    });

    it('should fire editCurrentTeamMember if current org member was just added to the team', () => {
      actions$ = hot('a', {
        a: TeamActions.addTeamMember({
          createTeamMemberDto: testBaseCreateTeamMemberDto1,
        }),
      });
      const expected$ = hot('(ab)', {
        a: TeamActions.addTeamMemberSuccess({
          teamMember: testTeamMemberRelation1,
        }),
        b: TeamActions.editCurrentTeamMember({ teamMember: testTeamMember1 }),
      });
      expect(effects.addTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createTeamMember).toHaveBeenCalledTimes(1);
        expect(service.createTeamMember).toHaveBeenCalledWith(
          testBaseCreateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedTeam isn't set`, () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: initialTeamState,
      });
      actions$ = hot('a', {
        a: TeamActions.addTeamMember({
          createTeamMemberDto: testBaseCreateTeamMemberDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.addTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createTeamMember).not.toHaveBeenCalled();
      });
    });
  });

  describe('editTeamMember$', () => {
    it('should fire editTeamMemberSuccess if successful', () => {
      actions$ = hot('a', {
        a: TeamActions.editTeamMember({
          orgMemberSlug: testOrgMember2.slug,
          updateTeamMemberDto: testBaseUpdateTeamMemberDto1,
        }),
      });
      const expected$ = hot('a', {
        a: TeamActions.editTeamMemberSuccess({
          teamMember: testTeamMember1,
          orgMemberSlug: testOrgMember2.slug,
        }),
      });
      expect(effects.editTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editTeamMember).toHaveBeenCalledTimes(1);
        expect(service.editTeamMember).toHaveBeenCalledWith(
          testBaseUpdateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember2.slug,
        );
      });
    });

    it('should fire editCurrentTeamMember if current org member was just edited in the team', () => {
      actions$ = hot('a', {
        a: TeamActions.editTeamMember({
          orgMemberSlug: testOrgMember1.slug,
          updateTeamMemberDto: testBaseUpdateTeamMemberDto1,
        }),
      });
      const expected$ = hot('(ab)', {
        a: TeamActions.editTeamMemberSuccess({
          orgMemberSlug: testOrgMember1.slug,
          teamMember: testTeamMember1,
        }),
        b: TeamActions.editCurrentTeamMember({ teamMember: testTeamMember1 }),
      });
      expect(effects.editTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editTeamMember).toHaveBeenCalledTimes(1);
        expect(service.editTeamMember).toHaveBeenCalledWith(
          testBaseUpdateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedTeam isn't set`, () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: initialTeamState,
      });
      actions$ = hot('a', {
        a: TeamActions.editTeamMember({
          orgMemberSlug: testOrgMember1.slug,
          updateTeamMemberDto: testBaseUpdateTeamMemberDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.editTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editTeamMember).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteTeamMember$', () => {
    it('should fire deleteTeamMemberSuccess if successful', () => {
      actions$ = hot('a', {
        a: TeamActions.deleteTeamMember({
          orgMemberSlug: testOrgMember2.slug,
        }),
      });
      const expected$ = hot('a', {
        a: TeamActions.deleteTeamMemberSuccess({
          orgMemberSlug: testOrgMember2.slug,
        }),
      });
      expect(effects.deleteTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.deleteTeamMember).toHaveBeenCalledTimes(1);
        expect(service.deleteTeamMember).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember2.slug,
        );
      });
    });

    it('should fire editCurrentTeamMember if current org member was just deleted from the team', () => {
      actions$ = hot('a', {
        a: TeamActions.deleteTeamMember({
          orgMemberSlug: testOrgMember1.slug,
        }),
      });
      const expected$ = hot('(ab)', {
        a: TeamActions.deleteTeamMemberSuccess({
          orgMemberSlug: testOrgMember1.slug,
        }),
        b: TeamActions.editCurrentTeamMember({ teamMember: null }),
      });
      expect(effects.deleteTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.deleteTeamMember).toHaveBeenCalledTimes(1);
        expect(service.deleteTeamMember).toHaveBeenCalledWith(
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedTeam isn't set`, () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Team]: initialTeamState,
      });
      actions$ = hot('a', {
        a: TeamActions.deleteTeamMember({
          orgMemberSlug: testOrgMember1.slug,
        }),
      });
      const expected$ = hot('-');
      expect(effects.deleteTeamMember$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.deleteTeamMember).not.toHaveBeenCalled();
      });
    });
  });
});
