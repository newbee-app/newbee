import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  catchHttpScreenError,
  catchToastError,
  organizationFeature,
  OrgMemberActions,
  ToastActions,
} from '@newbee/newbee/shared/data-access';
import {
  AlertType,
  canGetMoreResults,
  ShortUrl,
  Toast,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import {
  BaseGetOrgMemberPostsDto,
  defaultLimit,
  emailIsEmail,
  Keyword,
  orgRoleIsEnum,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { OrgMemberService } from '../org-member.service';
import {
  selectOrgMemberAndOrg,
  selectOrgMemberPostsAndOrg,
} from './org-member.selector';

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
              catchError(catchToastError),
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
            catchError(catchToastError),
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

  getDocs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.getDocs),
      concatLatestFrom(() => this.store.select(selectOrgMemberPostsAndOrg)),
      filter(
        ([, { docs, selectedOrgMember, selectedOrganization }]) =>
          !!(
            selectedOrganization &&
            selectedOrgMember &&
            canGetMoreResults(docs)
          ),
      ),
      switchMap(
        ([{ role }, { docs, selectedOrgMember, selectedOrganization }]) => {
          const getOrgMemberPostsDto: BaseGetOrgMemberPostsDto = {
            offset: docs ? docs.offset + 1 : 0,
            limit: docs ? docs.limit : defaultLimit,
            ...(role && { role }),
          };
          return this.orgMemberService
            .getAllDocs(
              selectedOrganization?.organization.slug as string,
              selectedOrgMember?.orgMember.slug as string,
              getOrgMemberPostsDto,
            )
            .pipe(
              map((docs) => {
                return OrgMemberActions.getDocsSuccess({ docs });
              }),
              catchError((err) =>
                catchHttpClientError(err, () => Keyword.Misc),
              ),
            );
        },
      ),
    );
  });

  getQnas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.getQnas),
      concatLatestFrom(() => this.store.select(selectOrgMemberPostsAndOrg)),
      filter(
        ([, { qnas, selectedOrgMember, selectedOrganization }]) =>
          !!(
            selectedOrganization &&
            selectedOrgMember &&
            canGetMoreResults(qnas)
          ),
      ),
      switchMap(
        ([{ role }, { qnas, selectedOrgMember, selectedOrganization }]) => {
          const getOrgMemberPostsDto: BaseGetOrgMemberPostsDto = {
            offset: qnas ? qnas.offset + 1 : 0,
            limit: qnas ? qnas.limit : defaultLimit,
            ...(role && { role }),
          };
          return this.orgMemberService
            .getAllQnas(
              selectedOrganization?.organization.slug as string,
              selectedOrgMember?.orgMember.slug as string,
              getOrgMemberPostsDto,
            )
            .pipe(
              map((qnas) => {
                return OrgMemberActions.getQnasSuccess({ qnas });
              }),
              catchError((err) =>
                catchHttpClientError(err, () => Keyword.Misc),
              ),
            );
        },
      ),
    );
  });

  inviteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.inviteUser),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createOrgMemberInviteDto }, selectedOrganization]) => {
        const { email } = createOrgMemberInviteDto;

        return this.orgMemberService
          .inviteUser(
            selectedOrganization?.organization.slug as string,
            createOrgMemberInviteDto,
          )
          .pipe(
            map(() => {
              return OrgMemberActions.inviteUserSuccess({ email });
            }),
            catchError((err) =>
              catchHttpClientError(err, (msg) => {
                switch (msg) {
                  case emailIsEmail:
                    return 'email';
                  case orgRoleIsEnum:
                    return 'role';
                  default:
                    return Keyword.Misc;
                }
              }),
            ),
          );
      }),
    );
  });

  inviteUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrgMemberActions.inviteUserSuccess),
      map(({ email }) => {
        return ToastActions.addToast({
          toast: new Toast(
            'Your invitation has been sent!',
            `An invitation was successfully sent to ${email} to join your org.`,
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
          ),
        });
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orgMemberService: OrgMemberService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
