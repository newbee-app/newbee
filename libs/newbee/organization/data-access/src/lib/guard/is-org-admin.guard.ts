import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { compareOrgRoles, OrgRoleEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

/**
 * A route guard preventing users from accessing the link unless the user is an org member with admin-level privileges.
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const isOrgAdminGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(organizationFeature.selectOrgState).pipe(
    take(1),
    map(({ selectedOrganization, orgMember }) => {
      if (
        orgMember &&
        compareOrgRoles(orgMember.orgMember.role, OrgRoleEnum.Moderator) >= 0
      ) {
        return true;
      }

      if (selectedOrganization) {
        return router.createUrlTree([
          `/${ShortUrl.Organization}/${selectedOrganization.slug}`,
        ]);
      }

      return router.createUrlTree(['/']);
    })
  );
};
