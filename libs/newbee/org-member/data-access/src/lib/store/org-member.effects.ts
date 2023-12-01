import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  OrgMemberActions,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { OrgMemberService } from '../org-member.service';
import { selectOrgMemberAndOrg } from './org-member.selector';

/**
 * The effects tied to `OrgMemberActions`.
 */
@Injectable()
export class OrgMemberEffects {
  getOrgMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.getOrgMember),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.orgMemberService
          .get(selectedOrganization?.organization.slug as string, slug)
          .pipe(
            map((orgMember) => {
              return OrgMemberActions.getOrgMemberSuccess({ orgMember });
            }),
            catchError(catchHttpScreenError),
          );
      }),
    );
  });

  editOrgMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.editOrgMember),
      concatLatestFrom(() => this.store.select(selectOrgMemberAndOrg)),
      filter(
        ([, { selectedOrganization, selectedOrgMember }]) =>
          !!(selectedOrganization && selectedOrgMember),
      ),
      switchMap(
        ([
          { updateOrgMemberDto },
          { selectedOrganization, selectedOrgMember },
        ]) => {
          return this.orgMemberService
            .edit(
              selectedOrganization?.organization.slug as string,
              selectedOrgMember?.orgMember.slug as string,
              updateOrgMemberDto,
            )
            .pipe(
              map((orgMember) => {
                return OrgMemberActions.editOrgMemberSuccess({ orgMember });
              }),
            );
        },
      ),
    );
  });

  deleteOrgMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.deleteOrgMember),
      concatLatestFrom(() => this.store.select(selectOrgMemberAndOrg)),
      filter(
        ([, { selectedOrganization, selectedOrgMember }]) =>
          !!(selectedOrganization && selectedOrgMember),
      ),
      switchMap(([, { selectedOrganization, selectedOrgMember }]) => {
        return this.orgMemberService
          .delete(
            selectedOrganization?.organization.slug as string,
            selectedOrgMember?.orgMember.slug as string,
          )
          .pipe(
            map(() => {
              return OrgMemberActions.deleteOrgMemberSuccess();
            }),
            catchError((err) =>
              catchHttpClientError(
                err,
                () => `${Keyword.Member}-${Keyword.Delete}`,
              ),
            ),
          );
      }),
    );
  });

  deleteOrgMemberSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrgMemberActions.deleteOrgMemberSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        tap(async ([, selectedOrganization]) => {
          if (!selectedOrganization) {
            await this.router.navigate(['/']);
            return;
          }

          await this.router.navigate([
            `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly orgMemberService: OrgMemberService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
