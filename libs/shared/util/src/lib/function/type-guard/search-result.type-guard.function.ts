import type {
  DocSearchResult,
  OrgMemberSearchResult,
  OrgSearchResultType,
  QnaSearchResult,
  TeamSearchResult,
} from '../../type';

/**
 * Checks whether a given org search result is an `OrgMemberSearchResult`.
 *
 * @param orgSearchResult The org search result to check.
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
 * @returns `true` if the org search result is an `QnaSearchResult`, `false` otherwise.
 */
export function isQnaSearchResult(
  orgSearchResult: OrgSearchResultType,
): orgSearchResult is QnaSearchResult {
  return 'qna' in orgSearchResult;
}
