import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DocActions,
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OffsetAndLimit,
  defaultLimit,
  docIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { DocService } from '../doc.service';
import { selectDocAndOrg, selectDocsAndOrg } from './doc.selector';

@Injectable()
export class DocEffects {
  getDocs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.getDocs),
      concatLatestFrom(() => this.store.select(selectDocsAndOrg)),
      filter(([, { selectedOrganization }]) => !!selectedOrganization),
      switchMap(([, { selectedOrganization, docs }]) => {
        if (docs && docs.total <= docs.limit * (docs.offset + 1)) {
          return of(DocActions.getDocsSuccess({ docs }));
        }

        const offsetAndLimit: OffsetAndLimit = {
          offset: docs ? docs.offset + 1 : 0,
          limit: docs ? docs.limit : defaultLimit,
        };
        return this.docService
          .getAll(
            selectedOrganization?.organization.slug as string,
            offsetAndLimit,
          )
          .pipe(
            map((docs) => {
              return DocActions.getDocsSuccess({ docs });
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
          );
      }),
    );
  });

  createDoc$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.createDoc),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createDocDto }, selectedOrganization]) => {
        return this.docService
          .create(
            selectedOrganization?.organization.slug as string,
            createDocDto,
          )
          .pipe(
            map((doc) => {
              return DocActions.createDocSuccess({ doc });
            }),
            catchError((err) =>
              catchHttpClientError(err, (msg) => {
                switch (msg) {
                  case titleIsNotEmpty:
                    return 'title';
                  case upToDateDurationMatches:
                    return 'upToDateDuration';
                  case docIsNotEmpty:
                    return Keyword.Doc;
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

  createDocSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DocActions.createDocSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ doc }, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.organization.slug as string
            }/${ShortUrl.Doc}/${doc.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  getDoc$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.getDoc),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.docService
          .get(slug, selectedOrganization?.organization.slug as string)
          .pipe(
            map((docAndMemberDto) => {
              return DocActions.getDocSuccess({ docAndMemberDto });
            }),
            catchError(catchHttpScreenError),
          );
      }),
    );
  });

  markDocAsUpToDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.markDocAsUpToDate),
      concatLatestFrom(() => this.store.select(selectDocAndOrg)),
      filter(
        ([, { selectedDoc, selectedOrganization }]) =>
          !!(selectedDoc && selectedOrganization),
      ),
      switchMap(([, { selectedDoc, selectedOrganization }]) => {
        return this.docService
          .markUpToDate(
            selectedDoc?.doc.slug as string,
            selectedOrganization?.organization.slug as string,
          )
          .pipe(
            map((doc) => {
              return DocActions.markDocAsUpToDateSuccess({ doc });
            }),
            catchError((err) => catchHttpClientError(err, () => 'up-to-date')),
          );
      }),
    );
  });

  editDoc$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.editDoc),
      concatLatestFrom(() => this.store.select(selectDocAndOrg)),
      filter(
        ([, { selectedDoc, selectedOrganization }]) =>
          !!(selectedDoc && selectedOrganization),
      ),
      switchMap(([{ updateDocDto }, { selectedDoc, selectedOrganization }]) => {
        return this.docService
          .edit(
            selectedDoc?.doc.slug as string,
            selectedOrganization?.organization.slug as string,
            updateDocDto,
          )
          .pipe(
            map((docAndMemberDto) => {
              return DocActions.getDocSuccess({ docAndMemberDto });
            }),
            catchError((err) =>
              catchHttpClientError(err, (msg) => {
                switch (msg) {
                  case titleIsNotEmpty:
                    return 'title';
                  case upToDateDurationMatches:
                    return 'duration';
                  case docIsNotEmpty:
                    return Keyword.Doc;
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

  deleteDoc$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocActions.deleteDoc),
      concatLatestFrom(() => this.store.select(selectDocAndOrg)),
      filter(
        ([, { selectedDoc, selectedOrganization }]) =>
          !!(selectedDoc && selectedOrganization),
      ),
      switchMap(([, { selectedDoc, selectedOrganization }]) => {
        return this.docService
          .delete(
            selectedDoc?.doc.slug as string,
            selectedOrganization?.organization.slug as string,
          )
          .pipe(
            map(() => {
              return DocActions.deleteDocSuccess();
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
          );
      }),
    );
  });

  deleteDocSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DocActions.deleteDocSuccess),
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
    private readonly docService: DocService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
