import type {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  QueryResultType,
  TeamQueryResult,
} from '../../type';

/**
 * Checks whether a given query result is an `OrgMemberQueryResult`.
 *
 * @param queryResult The query result to check.
 * @returns `true` if the query result is an `OrgMemberQueryResult`, `false` otherwise.
 */
export function resultIsOrgMemberQueryResult(
  queryResult: QueryResultType
): queryResult is OrgMemberQueryResult {
  return 'orgMember' in queryResult && 'user' in queryResult;
}

/**
 * Checks whether a given query result is a `TeamQueryResult`.
 *
 * @param queryResult The query result to check.
 * @returns `true` if the query result is a `TeamQueryResult`, `false` otherwise.
 */
export function resultIsTeamQueryResult(
  queryResult: QueryResultType
): queryResult is TeamQueryResult {
  return 'name' in queryResult && 'slug' in queryResult;
}

/**
 * Checks whether a given query result is an `DocQueryResult`.
 *
 * @param queryResult The query result to check.
 * @returns `true` if the query result is an `DocQueryResult`, `false` otherwise.
 */
export function resultIsDocQueryResult(
  queryResult: QueryResultType
): queryResult is DocQueryResult {
  return 'doc' in queryResult;
}

/**
 * Checks whether a given query result is an `QnaQueryResult`.
 *
 * @param queryResult The query result to check.
 * @returns `true` if the query result is an `QnaQueryResult`, `false` otherwise.
 */
export function resultIsQnaQueryResult(
  queryResult: QueryResultType
): queryResult is QnaQueryResult {
  return 'qna' in queryResult;
}
