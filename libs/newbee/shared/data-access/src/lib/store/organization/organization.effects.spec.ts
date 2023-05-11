import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { testOrganization1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../../service';
import { OrganizationActions } from './organization.actions';
import { OrganizationEffects } from './organization.effects';

describe('OrganizationEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: OrganizationEffects;
  let service: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationEffects,
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            getAndSelectOrg: jest
              .fn()
              .mockReturnValue(of(testOrgMemberRelation1)),
          }),
        },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OrganizationEffects);
    service = TestBed.inject(OrganizationService);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAndSelectOrg$', () => {
    it('should fire getAndSelectOrgSuccess if successful and orgSlug is not null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.getAndSelectOrg({
          orgSlug: testOrganization1.slug,
        }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.getAndSelectOrgSuccess({
          orgMember: testOrgMemberRelation1,
        }),
      });
      expect(effects.getAndSelectOrg$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAndSelectOrg).toBeCalledTimes(1);
        expect(service.getAndSelectOrg).toBeCalledWith(testOrganization1.slug);
      });
    });

    it('should fire getAndSelectOrgSuccess if orgSlug is null', () => {
      actions$ = hot('a', {
        a: OrganizationActions.getAndSelectOrg({ orgSlug: null }),
      });
      const expected$ = hot('a', {
        a: OrganizationActions.getAndSelectOrgSuccess({ orgMember: null }),
      });
      expect(effects.getAndSelectOrg$).toBeObservable(expected$);
    });
  });
});
