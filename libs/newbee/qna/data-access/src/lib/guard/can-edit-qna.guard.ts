import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { RoleType, apiRoles, checkRoles } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectQnaAndOrgStates } from '../store';

/**
 * A guard to check whether the current user can edit the route's qna.
 *
 * @returns An observable returning `true` if there are adequate permissions, a redirect to the org or home page if not.
 */
export const canEditQnaGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectQnaAndOrgStates).pipe(
    take(1),
    map(
      ({
        qnaState: { selectedQna: qna, teamMember },
        orgState: { selectedOrganization, orgMember: orgMemberRelation },
      }) => {
        const redirectRoute = selectedOrganization
          ? `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`
          : '/';
        if (!qna) {
          return router.createUrlTree([redirectRoute]);
        }

        const orgMember = orgMemberRelation?.orgMember ?? null;
        if (
          checkRoles(
            new Set(
              (apiRoles.qna.updateQuestion as RoleType[]).concat(
                apiRoles.qna.updateAnswer,
                apiRoles.qna.markUpToDate,
                apiRoles.qna.delete,
              ),
            ),
            {
              orgMember,
              teamRole: teamMember?.role,
              team: !!qna.team,
              postCreator: qna.creator?.orgMember,
              postMaintainer: qna.maintainer?.orgMember,
            },
          )
        ) {
          return true;
        }

        return router.createUrlTree([redirectRoute]);
      },
    ),
  );
};
