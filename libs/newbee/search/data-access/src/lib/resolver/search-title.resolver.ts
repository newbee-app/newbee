import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Keyword } from '@newbee/shared/util';

/**
 * A resolver to get the title for search results.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 * @returns The query the user is searching for, `Error` if the parent title encountered an error earlier.
 */
export const searchTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): string => {
  const parentTitle = route.parent?.title ?? '';
  if (parentTitle.includes('Error')) {
    return parentTitle;
  }

  const query = route.paramMap.get(Keyword.Search);
  return `${query} - ${parentTitle}`;
};
