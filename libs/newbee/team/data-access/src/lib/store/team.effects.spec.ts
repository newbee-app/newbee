import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrgMemberRelation1,
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
            org: { selectedOrganization: testOrgMemberRelation1 },
          },
        }),
        TeamEffects,
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            get: jest.fn().mockReturnValue(of(testTeamRelation1)),
            create: jest.fn().mockReturnValue(of(testTeamRelation1)),
            checkSlug: jest.fn().mockReturnValue(of(testBaseSlugTakenDto1)),
            generateSlug: jest
              .fn()
              .mockReturnValue(of(testBaseGeneratedSlugDto1)),
          }),
        },
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    });

    effects = TestBed.inject(TeamEffects);
    service = TestBed.inject(TeamService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
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
        a: TeamActions.getTeamSuccess({ team: testTeamRelation1 }),
      });
      expect(effects.getTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toBeCalledTimes(1);
        expect(service.get).toBeCalledWith(
          testTeam1.slug,
          testOrganization1.slug
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
        a: TeamActions.createTeamSuccess({ team: testTeamRelation1 }),
      });
      expect(effects.createTeam$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(
          testBaseCreateTeamDto1,
          testOrganization1.slug
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
        a: TeamActions.createTeamSuccess({ team: testTeamRelation1 }),
      });
      const expected$ = hot('a', {
        a: TeamActions.createTeamSuccess({ team: testTeamRelation1 }),
      });
      expect(effects.createTeamSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
          `/${testOrganization1.slug}/${UrlEndpoint.Team}/${testTeamRelation1.team.slug}`,
        ]);
      });
    });
  });

  describe('checkSlug$', () => {
    it('should fire checkSlugSuccess if successful', () => {
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
          testOrganization1.slug
        );
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
          testOrganization1.slug
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
