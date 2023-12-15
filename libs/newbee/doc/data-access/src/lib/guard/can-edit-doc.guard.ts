import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { RoleType, apiRoles, checkRoles } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectDocAndOrgStates } from '../store';

/**
 * A guard to check whether the current user can edit the route's doc.
 *
 * @returns An observable returning `true` if there are adequate permissions, a redirect to the org or home page if not.
 */
export const canEditDocGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectDocAndOrgStates).pipe(
    take(1),
    map(
      ({
        docState: { selectedDoc: doc, teamMember },
        orgState: { selectedOrganization, orgMember: orgMemberRelation },
      }) => {
        const redirectRoute = selectedOrganization
          ? `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`
          : '/';
        if (!doc) {
          return router.createUrlTree([redirectRoute]);
        }

        const orgMember = orgMemberRelation?.orgMember ?? null;
        if (
          checkRoles(
            new Set(
              (apiRoles.doc.update as RoleType[]).concat(
                apiRoles.doc.markUpToDate,
                apiRoles.doc.delete,
              ),
            ),
            {
              orgMember,
              teamRole: teamMember?.role,
              team: !!doc.team,
              postCreator: doc.creator?.orgMember,
              postMaintainer: doc.maintainer?.orgMember,
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
