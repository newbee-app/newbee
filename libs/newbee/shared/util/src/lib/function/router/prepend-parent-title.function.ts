import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Prepends the given title to the given route's parent's title.
 *
 * @param route The route whose parent's title we should prepend the title to.
 * @param title The title to prepend.
 *
 * @returns A new title with the given title prepended to the route's parent's title.
 */
export function prependParentTitle(
  route: ActivatedRouteSnapshot,
  title: string,
): string {
  let parent = route.parent;
  while (parent && !parent.title) {
    parent = parent.parent;
  }

  const parentTitle = parent?.title ?? '';
  if (parentTitle.includes('Error')) {
    return parentTitle;
  }

  return [title, parentTitle].filter(Boolean).join(' - ');
}
