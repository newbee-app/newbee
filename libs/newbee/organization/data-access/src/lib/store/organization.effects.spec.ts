import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { testOrgForm1 } from '@newbee/newbee/organization/util';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
} from '@newbee/shared/data-access';
import { testOrganization1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { OrganizationEffects } from './organization.effects';

describe('OrganizationEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: OrganizationEffects;
  let service: OrganizationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        OrganizationEffects,
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            get: jest.fn().mockReturnValue(of(testOrgMemberRelation1)),
            create: jest.fn().mockReturnValue(of(testOrganization1)),
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

    effects = TestBed.inject(OrganizationEffects);
    service = TestBed.inject(OrganizationService);
    router = TestBed.inject(Router);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('getOrg$', () => {
    it('should fire getOrgSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.getOrg({
          orgSlug: testOrganization1.slug,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.getOrgSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      expect(effects.getOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toBeCalledTimes(1);
        expect(service.get).toBeCalledWith(testOrganization1.slug);
      });
    });
  });

  describe('create$', () => {
    it('should fire createSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.createOrg({ createOrgForm: testOrgForm1 }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      });
      expect(effects.createOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(testOrgForm1);
      });
    });
  });

  describe('createOrgSuccess$', () => {
    it('should navigate to org', () => {
      actions$ = hot('a', {
        a: OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      });
      expect(effects.createOrgSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([`/${testOrganization1.slug}`]);
      });
    });
  });

  describe('checkSlug$', () => {
    it('should fire checkSlugSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.checkSlug({ slug: testOrganization1.slug }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.checkSlugSuccess({
          slugTaken: true,
        }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).toBeCalledTimes(1);
        expect(service.checkSlug).toBeCalledWith(testOrganization1.slug);
      });
    });

    it('should do nothing if slug is an empty string', () => {
      actions$ = hot('a', { a: OrganizationActions.checkSlug({ slug: '' }) });
      const expected$ = hot('-');
      expect(effects.checkSlug$).toBeObservable(expected$);
    });
  });

  describe('generateSlug$', () => {
    it('should fire generateSlugSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.generateSlug({ name: testOrganization1.name }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.generateSlugSuccess({
          slug: testBaseGeneratedSlugDto1.generatedSlug,
        }),
      });
      expect(effects.generateSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.generateSlug).toBeCalledTimes(1);
        expect(service.generateSlug).toBeCalledWith(testOrganization1.name);
      });
    });

    it('should do nothing if name is an empty string', () => {
      actions$ = hot('a', {
        a: OrganizationActions.generateSlug({ name: '' }),
      });
      const expected$ = hot('-');
      expect(effects.generateSlug$).toBeObservable(expected$);
    });
  });
});
