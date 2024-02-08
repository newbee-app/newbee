import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testCreateOrganizationDto1,
  testGeneratedSlugDto1,
  testOrgAndMemberDto1,
  testOrganization1,
  testOrganization2,
  testOrganizationRelation1,
  testSlugTakenDto1,
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
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              selectedOrganization: testOrganizationRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        OrganizationEffects,
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            get: jest.fn().mockReturnValue(of(testOrgAndMemberDto1)),
            create: jest.fn().mockReturnValue(of(testOrganization1)),
            edit: jest.fn().mockReturnValue(of(testOrganization2)),
            delete: jest.fn().mockReturnValue(of(null)),
            checkSlug: jest.fn().mockReturnValue(of(testSlugTakenDto1)),
            generateSlug: jest.fn().mockReturnValue(of(testGeneratedSlugDto1)),
          }),
        },
      ],
    });

    effects = TestBed.inject(OrganizationEffects);
    service = TestBed.inject(OrganizationService);
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

  describe('getOrg$', () => {
    it('should fire getOrgSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.getOrg({
          orgSlug: testOrganization1.slug,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.getOrgSuccess({
          orgAndMemberDto: testOrgAndMemberDto1,
        }),
      });
      expect(effects.getOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toHaveBeenCalledTimes(1);
        expect(service.get).toHaveBeenCalledWith(testOrganization1.slug);
      });
    });
  });

  describe('create$', () => {
    it('should fire createSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.createOrg({
          createOrganizationDto: testCreateOrganizationDto1,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.createOrgSuccess({
          organization: testOrganization1,
        }),
      });
      expect(effects.createOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(service.create).toHaveBeenCalledWith(testCreateOrganizationDto1);
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
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}`,
        ]);
      });
    });
  });

  describe('editOrg$', () => {
    it('should fire editOrgSuccess if successful for editOrg', () => {
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
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(testOrganization1.slug, {
          name: testOrganization1.name,
        });
      });
    });

    it('should fire editOrgSlugSuccess if successful for editOrgSlug', () => {
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
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(testOrganization1.slug, {
          slug: testOrganization2.slug,
        });
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      store.setState({});
      actions$ = hot('a', {
        a: OrganizationActions.editOrg({
          updateOrganizationDto: { name: testOrganization1.name },
        }),
      });
      const expected$ = hot('-');
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toHaveBeenCalled();
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
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}/${Keyword.Edit}`,
        ]);
      });
    });
  });

  describe('deleteOrg$', () => {
    it('should fire deleteOrgSuccess if successful', () => {
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrg(),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      expect(effects.deleteOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(testOrganization1.slug);
      });
    });

    it('should do nothing if selectedOrganization is null', () => {
      store.setState({});
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrg(),
      });
      const expected$ = hot('-');
      expect(effects.editOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteOrgSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.deleteOrgSuccess(),
      });
      expect(effects.deleteOrgSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('checkSlug$', () => {
    it('should fire checkSlugSuccess if successful', () => {
      store.setState({});
      actions$ = hot('a', {
        a: OrganizationActions.checkSlug({ slug: testOrganization1.slug }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.checkSlugSuccess({
          slugTaken: testSlugTakenDto1.slugTaken,
        }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).toHaveBeenCalledTimes(1);
        expect(service.checkSlug).toHaveBeenCalledWith(testOrganization1.slug);
      });
    });

    it('should do nothing if slug is an empty string', () => {
      actions$ = hot('a', { a: OrganizationActions.checkSlug({ slug: '' }) });
      const expected$ = hot('-');
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toHaveBeenCalled();
      });
    });

    it('should fire checkSlugSccuess with slugTaken as false if slug is the same as selectedOrganization', () => {
      actions$ = hot('a', {
        a: OrganizationActions.checkSlug({ slug: testOrganization1.slug }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.checkSlugSuccess({ slugTaken: false }),
      });
      expect(effects.checkSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.checkSlug).not.toHaveBeenCalled();
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
          slug: testGeneratedSlugDto1.generatedSlug,
        }),
      });
      expect(effects.generateSlug$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.generateSlug).toHaveBeenCalledTimes(1);
        expect(service.generateSlug).toHaveBeenCalledWith(
          testOrganization1.name,
        );
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
