import type {
  AppSearchResultType,
  DocSearchResult,
  OrgMemberSearchResult,
  OrgSearchResultType,
  QnaSearchResult,
  TeamSearchResult,
  UserSearchResult,
  WaitlistMemberSearchResult,
} from '../../type';

/**
 * Checks whether a given org search result is an `OrgMemberSearchResult`.
 *
 * @param orgSearchResult The org search result to check.
 *
 * @returns `true` if the org search result is an `OrgMemberSearchResult`, `false` otherwise.
 */
export function isOrgMemberSearchResult(
  orgSearchResult: OrgSearchResultType,
): orgSearchResult is OrgMemberSearchResult {
  return 'orgMember' in orgSearchResult && 'user' in orgSearchResult;
}

/**
 * Checks whether a given org search result is a `TeamSearchResult`.
 *
 * @param orgSearchResult The org search result to check.
 *
 * @returns `true` if the org search result is a `TeamSearchResult`, `false` otherwise.
 */
export function isTeamSearchResult(
  orgSearchResult: OrgSearchResultType,
): orgSearchResult is TeamSearchResult {
  return 'name' in orgSearchResult && 'slug' in orgSearchResult;
}

/**
 * Checks whether a given org search result is an `DocSearchResult`.
 *
 * @param orgSearchResult The org search result to check.
 *
 * @returns `true` if the org search result is an `DocSearchResult`, `false` otherwise.
 */
export function isDocSearchResult(
  orgSearchResult: OrgSearchResultType,
): orgSearchResult is DocSearchResult {
  return 'doc' in orgSearchResult;
}

/**
 * Checks whether a given org search result is an `QnaSearchResult`.
 *
 * @param orgSearchResult The org search result to check.
 *
 * @returns `true` if the org search result is an `QnaSearchResult`, `false` otherwise.
 */
export function isQnaSearchResult(
  orgSearchResult: OrgSearchResultType,
): orgSearchResult is QnaSearchResult {
  return 'qna' in orgSearchResult;
}

/**
 * Checks whether a given app search result is a `UserSearchResult`.
 *
 * @param appSearchResult The app search result to check.
 *
 * @returns `true` if the app search result is a `UserSearchResult`, `false` otherwise.
 */
export function isUserSearchResult(
  appSearchResult: AppSearchResultType,
): appSearchResult is UserSearchResult {
  return 'role' in appSearchResult;
}

/**
 * Checks whether a given app search result is a `WaitlistMemberSearchResult`.
 *
 * @param appSearchResult The app search result to check.
 *
 * @returns `true` if the app search result is a `WaitlistMemberSearchResult`, `false` otherwise.
 */
export function isWaitlistMemberSearchResult(
  appSearchResult: AppSearchResultType,
): appSearchResult is WaitlistMemberSearchResult {
  return (
    'email' in appSearchResult &&
    'name' in appSearchResult &&
    !('role' in appSearchResult)
  );
}
