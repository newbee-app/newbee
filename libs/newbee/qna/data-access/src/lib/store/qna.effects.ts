import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  QnaActions,
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OffsetAndLimit,
  answerIsNotEmpty,
  defaultLimit,
  maintainerIsNotEmpty,
  questionIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { QnaService } from '../qna.service';
import { selectQnaAndOrg, selectQnasAndOrg } from './qna.selector';

@Injectable()
export class QnaEffects {
  getQnas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.getQnas),
      concatLatestFrom(() => this.store.select(selectQnasAndOrg)),
      filter(([, { qnas, selectedOrganization }]) => {
        return !!(
          selectedOrganization &&
          (!qnas || (qnas && qnas.total > qnas.limit * (qnas.offset + 1)))
        );
      }),
      switchMap(([, { qnas, selectedOrganization }]) => {
        const offsetAndLimit: OffsetAndLimit = {
          offset: qnas ? qnas.offset + 1 : 0,
          limit: qnas ? qnas.limit : defaultLimit,
        };
        return this.qnaService
          .getAllPaginated(
            selectedOrganization?.organization.slug as string,
            offsetAndLimit,
          )
          .pipe(
            map((qnas) => {
              return QnaActions.getQnasSuccess({ qnas });
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
          );
      }),
    );
  });

  createQna$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.createQna),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createQnaDto }, selectedOrganization]) => {
        return this.qnaService
          .create(
            createQnaDto,
            selectedOrganization?.organization.slug as string,
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
                  case questionIsNotEmpty:
                    return Keyword.Question;
                  case answerIsNotEmpty:
                    return Keyword.Answer;
                  case teamIsNotEmpty:
                    return Keyword.Team;
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
      concatLatestFrom(() => this.store.select(selectQnaAndOrg)),
      filter(
        ([, { selectedQna, selectedOrganization }]) =>
          !!(selectedQna && selectedOrganization),
      ),
      switchMap(([, { selectedQna, selectedOrganization }]) => {
        return this.qnaService
          .markUpToDate(
            selectedQna?.qna.slug as string,
            selectedOrganization?.organization.slug as string,
          )
          .pipe(
            map((qna) => {
              return QnaActions.editQnaSuccess({ qna });
            }),
            catchError((err) => catchHttpClientError(err, () => 'up-to-date')),
          );
      }),
    );
  });

  editQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.editQuestion),
      concatLatestFrom(() => this.store.select(selectQnaAndOrg)),
      filter(
        ([, { selectedQna, selectedOrganization }]) =>
          !!(selectedQna && selectedOrganization),
      ),
      switchMap(
        ([{ updateQuestionDto }, { selectedQna, selectedOrganization }]) => {
          return this.qnaService
            .editQuestion(
              selectedQna?.qna.slug as string,
              selectedOrganization?.organization.slug as string,
              updateQuestionDto,
            )
            .pipe(
              map((qnaAndMemberDto) => {
                return QnaActions.getQnaSuccess({ qnaAndMemberDto });
              }),
              catchError((err) =>
                catchHttpClientError(err, (msg) => {
                  switch (msg) {
                    case titleIsNotEmpty:
                      return 'title';
                    case questionIsNotEmpty:
                      return Keyword.Question;
                    case teamIsNotEmpty:
                      return Keyword.Team;
                    default:
                      return `${Keyword.Question}-${Keyword.Edit}`;
                  }
                }),
              ),
            );
        },
      ),
    );
  });

  editAnswer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.editAnswer),
      concatLatestFrom(() => this.store.select(selectQnaAndOrg)),
      filter(
        ([, { selectedQna, selectedOrganization }]) =>
          !!(selectedQna && selectedOrganization),
      ),
      switchMap(
        ([{ updateAnswerDto }, { selectedQna, selectedOrganization }]) => {
          return this.qnaService
            .editAnswer(
              selectedQna?.qna.slug as string,
              selectedOrganization?.organization.slug as string,
              updateAnswerDto,
            )
            .pipe(
              map((qna) => {
                return QnaActions.editQnaSuccess({ qna });
              }),
              catchError((err) =>
                catchHttpClientError(err, (msg) => {
                  switch (msg) {
                    case upToDateDurationMatches:
                      return 'upToDateDuration';
                    case answerIsNotEmpty:
                      return Keyword.Answer;
                    case maintainerIsNotEmpty:
                      return 'maintainer';
                    default:
                      return `${Keyword.Answer}-${Keyword.Edit}`;
                  }
                }),
              ),
            );
        },
      ),
    );
  });

  deleteQna$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QnaActions.deleteQna),
      concatLatestFrom(() => this.store.select(selectQnaAndOrg)),
      filter(
        ([, { selectedQna, selectedOrganization }]) =>
          !!(selectedQna && selectedOrganization),
      ),
      switchMap(([, { selectedQna, selectedOrganization }]) => {
        const qnaSlug = selectedQna?.qna.slug as string;
        return this.qnaService
          .delete(qnaSlug, selectedOrganization?.organization.slug as string)
          .pipe(
            map(() => {
              return QnaActions.deleteQnaSuccess();
            }),
            catchError((err) =>
              catchHttpClientError(err, () => Keyword.Delete),
            ),
          );
      }),
    );
  });

  deleteQnaSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(QnaActions.deleteQnaSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.organization.slug as string
            }`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly qnaService: QnaService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
