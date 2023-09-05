import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import {
  organizationFeature,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  compareOrgRoles,
  compareTeamRoles,
  OrgRoleEnum,
  TeamRoleEnum,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';

/**
 * A route guard preventing users from accessing the link unless the user is an org member or team member with admin-level privileges.
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const isTeamAdminGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(organizationFeature.selectOrgState),
    store.select(teamFeature.selectTeamState),
  ]).pipe(
    take(1),
    map(
      ([{ selectedOrganization, orgMember }, { selectedTeam, teamMember }]) => {
        if (
          orgMember &&
          compareOrgRoles(orgMember.orgMember.role, OrgRoleEnum.Moderator) >= 0
        ) {
          return true;
        }

        if (
          teamMember &&
          compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0
        ) {
          return true;
        }

        if (selectedOrganization) {
          if (selectedTeam) {
            return router.createUrlTree([
              `/${ShortUrl.Organization}/${selectedOrganization.slug}/${ShortUrl.Team}/${selectedTeam.team.slug}`,
            ]);
          }

          return router.createUrlTree([
            `/${ShortUrl.Organization}/${selectedOrganization.slug}`,
          ]);
        }

        return router.createUrlTree(['/']);
      }
    )
  );
};
