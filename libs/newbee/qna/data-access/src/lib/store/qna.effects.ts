import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  QnaActions,
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  qnaFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword, titleIsNotEmpty } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { QnaService } from '../qna.service';

@Injectable()
export class QnaEffects {
  createQna$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.createQna),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createQnaDto, team }, selectedOrganization]) => {
        return this.qnaService
          .create(
            createQnaDto,
            selectedOrganization?.organization.slug as string,
            team?.slug ?? null,
          )
          .pipe(
            map((qna) => {
              return QnaActions.createQnaSuccess({ qna });
            }),
            catchError((err) =>
              catchHttpClientError(err, (msg) => {
                switch (msg) {
                  case titleIsNotEmpty:
                    return 'title';
                  default:
                    return Keyword.Misc;
                }
              }),
            ),
          );
      }),
    );
  });

  createQnaSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(QnaActions.createQnaSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ qna }, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.organization.slug as string
            }/${ShortUrl.Qna}/${qna.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  getQna$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.getQna),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.qnaService
          .get(slug, selectedOrganization?.organization.slug as string)
          .pipe(
            map((qnaAndMemberDto) => {
              return QnaActions.getQnaSuccess({ qnaAndMemberDto });
            }),
            catchError(catchHttpScreenError),
          );
      }),
    );
  });

  markQnaAsUpToDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.markQnaAsUpToDate),
      concatLatestFrom(() => [
        this.store.select(qnaFeature.selectSelectedQna),
        this.store.select(organizationFeature.selectSelectedOrganization),
      ]),
      filter(
        ([, selectedQna, selectedOrganization]) =>
          !!(selectedQna && selectedOrganization),
      ),
      switchMap(([, selectedQna, selectedOrganization]) => {
        const oldQnaSlug = selectedQna?.qna.slug as string;
        return this.qnaService
          .markUpToDate(
            oldQnaSlug,
            selectedOrganization?.organization.slug as string,
          )
          .pipe(
            map((qna) => {
              return QnaActions.markQnaAsUpToDateSuccess({
                oldSlug: oldQnaSlug,
                newQna: qna,
              });
            }),
            catchError((err) => catchHttpClientError(err, () => 'up-to-date')),
          );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly qnaService: QnaService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
