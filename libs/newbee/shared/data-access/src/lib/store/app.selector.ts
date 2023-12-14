import { createSelector } from '@ngrx/store';
import { authFeature } from './auth';
import { cookieFeature } from './cookie';
import { httpFeature } from './http';
import { organizationFeature } from './organization';

/**
 * A selector for selecting the current user and CSRF token.
 */
export const selectUserAndCsrfToken = createSelector(
  authFeature.selectUser,
  cookieFeature.selectCsrfToken,
  (user, csrfToken) => ({ user, csrfToken }),
);

/**
 * Select the current csrf token and screen error.
 */
export const selectCsrfTokenAndScreenError = createSelector(
  cookieFeature.selectCsrfToken,
  httpFeature.selectScreenError,
  (csrfToken, screenError) => ({ csrfToken, screenError }),
);

/**
 * Select the current org member and user.
 */
export const selectOrgMemberUser = createSelector(
  organizationFeature.selectOrgMember,
  authFeature.selectUser,
  (orgMember, user) => {
    if (orgMember && user) {
      return { orgMember: orgMember.orgMember, user };
    }

    return null;
  },
);
