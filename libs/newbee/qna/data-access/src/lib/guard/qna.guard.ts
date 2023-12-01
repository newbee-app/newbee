import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectQnaAndScreenError } from '../store';

/**
 * A guard that fires the request to get a qna and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the qna is retrieved or an error is thrown.
 */
export const qnaGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const qnaSlug = route.paramMap.get(ShortUrl.Qna) as string;
  store.dispatch(QnaActions.getQna({ slug: qnaSlug }));

  return store.select(selectQnaAndScreenError).pipe(
    skipWhile(
      ({ selectedQna, screenError }) =>
        selectedQna?.qna.slug !== qnaSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
