import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrgMemberRelation1,
  testTeam1,
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
            create: jest.fn().mockReturnValue(of(testTeam1)),
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
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('createTeam$', () => {
    it('should fire createTeamSuccess if successful', () => {
      actions$ = hot('a', {
        a: TeamActions.createTeam({ createTeamDto: testBaseCreateTeamDto1 }),
      });
      const expected$ = hot('a', {
        a: TeamActions.createTeamSuccess({ team: testTeam1 }),
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
