import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import {
  userHasAnswerPermissions,
  userHasDeletePermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/qna/util';
import {
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, take } from 'rxjs';

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

  return combineLatest([
    store.select(qnaFeature.selectQnaState),
    store.select(organizationFeature.selectOrgState),
  ]).pipe(
    take(1),
    map(
      ([
        { selectedQna: qna, teamMember },
        { selectedOrganization, orgMember: orgMemberRelation },
      ]) => {
        const redirectRoute = selectedOrganization
          ? `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`
          : '/';
        if (!qna) {
          return router.createUrlTree([redirectRoute]);
        }

        const orgMember = orgMemberRelation?.orgMember ?? null;
        if (
          [
            userHasQuestionPermissions(qna, orgMember, teamMember),
            userHasAnswerPermissions(qna, orgMember, teamMember),
            userHasUpToDatePermissions(qna, orgMember, teamMember),
            userHasDeletePermissions(qna, orgMember, teamMember),
          ].includes(true)
        ) {
          return true;
        }

        return router.createUrlTree([redirectRoute]);
      },
    ),
  );
};
