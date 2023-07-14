import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseCreateOrganizationDto1,
  testBaseCreateOrgMemberInviteDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { OrganizationEffects } from './organization.effects';

describe('OrganizationEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: OrganizationEffects;
  let service: OrganizationService;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        OrganizationEffects,
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            get: jest.fn().mockReturnValue(of(testOrgMemberRelation1)),
            create: jest.fn().mockReturnValue(of(testOrganization1)),
            edit: jest.fn().mockReturnValue(of(testOrganization2)),
            delete: jest.fn().mockReturnValue(of(null)),
            checkSlug: jest.fn().mockReturnValue(of(testBaseSlugTakenDto1)),
            generateSlug: jest
              .fn()
              .mockReturnValue(of(testBaseGeneratedSlugDto1)),
            inviteUser: jest.fn().mockReturnValue(of(null)),
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
        a: OrganizationActions.createOrg({
          createOrganizationDto: testBaseCreateOrganizationDto1,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      });
      expect(effects.createOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(testBaseCreateOrganizationDto1);
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

  describe('editOrg$', () => {
    it('should fire editOrgSuccess if successful', () => {
      store.setState({
        org: {
          selectedOrganization: testOrgMemberRelation1,
        },
      });
      actions$ = hot('a', {
        a: OrganizationActions.editOrg({
          updateOrganizationDto: { name: testOrganization1.name },
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.editOrgSuccess({
          newOrg: testOrganization2,
        }),
      });
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(testOrganization1.slug, {
          name: testOrganization1.name,
        });
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.editOrg({
          updateOrganizationDto: { name: testOrganization1.name },
        }),
      });
      const expected$ = hot('-');
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toBeCalled();
      });
    });
  });

  describe('editOrgSlug$', () => {
    it('should fire editOrgSlugSuccess if successful', () => {
      store.setState({
        org: {
          selectedOrganization: testOrgMemberRelation1,
        },
      });
      actions$ = hot('a', {
        a: OrganizationActions.editOrgSlug({
          updateOrganizationDto: { slug: testOrganization2.slug },
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.editOrgSlugSuccess({
          newOrg: testOrganization2,
        }),
      });
      expect(effects.editOrgSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(testOrganization1.slug, {
          slug: testOrganization2.slug,
        });
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.editOrgSlug({
          updateOrganizationDto: { slug: testOrganization2.slug },
        }),
      });
      const expected$ = hot('-');
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toBeCalled();
      });
    });
  });

  describe('editOrgSlugSuccess$', () => {
    it('should navigate to org edit', () => {
      actions$ = hot('a', {
        a: OrganizationActions.editOrgSlugSuccess({
          newOrg: testOrganization1,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.editOrgSlugSuccess({
          newOrg: testOrganization1,
        }),
      });
      expect(effects.editOrgSlugSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
          `/${testOrganization1.slug}/${UrlEndpoint.Edit}`,
        ]);
      });
    });
  });

  describe('deleteOrg$', () => {
    it('should fire deleteOrgSuccess if successful', () => {
      store.setState({
        org: {
          selectedOrganization: testOrgMemberRelation1,
        },
      });
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrg(),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      expect(effects.deleteOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(testOrganization1.slug);
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrg(),
      });
      const expected$ = hot('-');
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toBeCalled();
      });
    });
  });

  describe('deleteOrgSlugSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      expect(effects.deleteOrgSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
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
          slugTaken: testBaseSlugTakenDto1.slugTaken,
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
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toBeCalled();
      });
    });

    it('should fire checkSlugSccuess with slugTaken as false if slug is the same as selectedOrganization', () => {
      store.setState({
        org: { selectedOrganization: testOrgMemberRelation1 },
      });
      actions$ = hot('a', {
        a: OrganizationActions.checkSlug({ slug: testOrganization1.slug }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.checkSlugSuccess({ slugTaken: false }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toBeCalled();
      });
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

  describe('inviteUser$', () => {
    it('should fire inviteUserSuccess if successful', () => {
      store.setState({
        org: {
          selectedOrganization: testOrgMemberRelation1,
        },
      });
      actions$ = hot('a', {
        a: OrganizationActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.inviteUserSuccess({
          email: testBaseCreateOrgMemberInviteDto1.email,
        }),
      });
      expect(effects.inviteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.inviteUser).toBeCalledTimes(1);
        expect(service.inviteUser).toBeCalledWith(
          testOrganization1.slug,
          testBaseCreateOrgMemberInviteDto1
        );
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.inviteUser$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.inviteUser).not.toBeCalled();
      });
    });
  });
});
