import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { httpFeature, qnaFeature } from '@newbee/newbee/shared/data-access';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for qna pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 * @returns The name of the selected qna if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const qnaTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): Observable<string> => {
  const store = inject(Store);

  const qnaSlug = route.paramMap.get(ShortUrl.Qna) as string;

  return combineLatest([
    store.select(qnaFeature.selectSelectedQna),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([qna, screenError]) => qna?.qna.slug !== qnaSlug && !screenError,
    ),
    take(1),
    map(([qna]) => prependParentTitle(route, qna ? qna.qna.title : 'Error')),
  );
};
