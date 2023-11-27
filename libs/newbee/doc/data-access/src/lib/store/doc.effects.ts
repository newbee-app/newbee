import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DocActions,
  catchHttpClientError,
  catchHttpScreenError,
  docFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  docIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { DocService } from '../doc.service';

@Injectable()
export class DocEffects {
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
      concatLatestFrom(() => [
        this.store.select(docFeature.selectSelectedDoc),
        this.store.select(organizationFeature.selectSelectedOrganization),
      ]),
      filter(
        ([, selectedDoc, selectedOrganization]) =>
          !!(selectedDoc && selectedOrganization),
      ),
      switchMap(([, selectedDoc, selectedOrganization]) => {
        return this.docService
          .markUpToDate(
            selectedDoc?.doc.slug as string,
            selectedOrganization?.organization.slug as string,
          )
          .pipe(
            map((doc) => {
              return DocActions.editDocSuccess({ doc });
            }),
            catchError((err) => catchHttpClientError(err, () => 'up-to-date')),
          );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly docService: DocService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
