import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  initialOrganizationState,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateTeamDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  testBaseTeamAndMemberDto1,
  testBaseUpdateTeamDto1,
  testOrganization1,
  testOrganizationRelation1,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { TeamService } from '../team.service';
import { TeamEffects } from './team.effects';

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
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Team]: {
              selectedTeam: testTeamRelation1,
            },
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
        expect(service.get).toBeCalledTimes(1);
        expect(service.get).toBeCalledWith(
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
        expect(service.get).not.toBeCalled();
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
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(
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
        expect(service.create).not.toBeCalled();
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
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
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(
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
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(
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
        expect(service.edit).not.toBeCalled();
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
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
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(
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
        expect(service.edit).not.toBeCalled();
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });
  });

  describe('checkSlug$', () => {
    it('should fire checkSlugSuccess if successful', () => {
      store.setState({
        [Keyword.Organization]: {
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
        expect(service.checkSlug).toBeCalledTimes(1);
        expect(service.checkSlug).toBeCalledWith(
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
        expect(service.checkSlug).not.toBeCalled();
      });
    });

    it('should do nothing if slug is an empty string', () => {
      actions$ = hot('a', { a: TeamActions.checkSlug({ slug: '' }) });
      const expected$ = hot('-');
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toBeCalled();
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
        expect(service.checkSlug).not.toBeCalled();
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
        expect(service.generateSlug).toBeCalledTimes(1);
        expect(service.generateSlug).toBeCalledWith(
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
        expect(service.generateSlug).not.toBeCalled();
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
        expect(service.generateSlug).not.toBeCalled();
      });
    });
  });
});
