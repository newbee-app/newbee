import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  OrgRoleEnum,
  TeamRoleEnum,
  compareOrgRoles,
  compareTeamRoles,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectTeamAndOrgStates } from '../store';

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

  return store.select(selectTeamAndOrgStates).pipe(
    take(1),
    map(
      ({
        teamState: { teamMember, selectedTeam },
        orgState: { orgMember, selectedOrganization },
      }) => {
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
              `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}/${ShortUrl.Team}/${selectedTeam.team.slug}`,
            ]);
          }

          return router.createUrlTree([
            `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`,
          ]);
        }

        return router.createUrlTree(['/']);
      },
    ),
  );
};
