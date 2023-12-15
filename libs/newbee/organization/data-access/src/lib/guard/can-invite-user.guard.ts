import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { apiRoles, checkRoles } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

/**
 * A route guard preventing users from accessing the link unless the user is an org member with the permissions to invite new users to the org.
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const canInviteUserGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(organizationFeature.selectOrgState).pipe(
    take(1),
    map(({ selectedOrganization, orgMember }) => {
      if (
        orgMember &&
        checkRoles(apiRoles['org-member-invite'].invite, {
          orgMember: orgMember.orgMember,
        })
      ) {
        return true;
      } else if (selectedOrganization) {
        return router.createUrlTree([
          `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`,
        ]);
      }

      return router.createUrlTree(['/']);
    }),
  );
};
