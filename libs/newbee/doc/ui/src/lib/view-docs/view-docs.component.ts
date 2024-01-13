import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  AlertComponent,
  SearchResultComponent,
  SearchbarComponent,
} from '@newbee/newbee/shared/ui';
import {
  HttpClientError,
  SearchResultFormat,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
import {
  DocQueryResult,
  Keyword,
  userDisplayName,
  type PaginatedResults,
} from '@newbee/shared/util';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject, takeUntil } from 'rxjs';

/**
 * Dumb UI for viewing all of the docs in an org.
 */
@Component({
  selector: 'newbee-view-docs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SearchbarComponent,
    SearchResultComponent,
    AlertComponent,
  ],
  templateUrl: './view-docs.component.html',
})
export class ViewDocsComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchResultFormat = SearchResultFormat;

  /**
   * The HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The docs of the org.
   */
  @Input()
  get docs(): PaginatedResults<DocQueryResult> | null {
    return this._docs;
  }
  set docs(docs: PaginatedResults<DocQueryResult> | null) {
    this._docs = docs;
    this.updateDocsToShow();
  }
  private _docs: PaginatedResults<DocQueryResult> | null = null;

  /**
   * Whether more docs are being fetched.
   */
  @Input() getDocsPending = false;

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Emits whenver the user fires a search request.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Indicates that the user has scrolled to the bottom of the results.
   */
  @Output() scrolled = new EventEmitter<void>();

  /**
   * The search term containing the searchbar.
   */
  searchForm = this.fb.group({ searchbar: '' });

  /**
   * The subset of the docs to show to the user.
   */
  get docsToShow(): DocQueryResult[] {
    return this._docsToShow;
  }
  private _docsToShow: DocQueryResult[] = [];

  /**
   * Update the docs to show using the current searchbar value.
   */
  constructor(private readonly fb: FormBuilder) {
    this.searchForm.controls.searchbar.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.updateDocsToShow();
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * The number of docs that were found, expressed as a string.
   */
  get docsFound(): string {
    if (!this._docs) {
      return 'No docs found';
    }

    return `${this._docs.total} ${
      this._docs.total === 1 ? 'doc' : 'docs'
    } found`;
  }

  /**
   * The misc error in the HTTP client error.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }

  /**
   * Emits the search event with the current searchbar value.
   */
  emitSearch(): void {
    const searchVal = this.searchForm.controls.searchbar.value;
    if (!searchVal) {
      return;
    }

    this.search.emit(searchVal);
  }

  /**
   * Update `docsToShow` to filter using the given search term.
   */
  private updateDocsToShow(): void {
    if (!this._docs) {
      this._docsToShow = [];
      return;
    }

    const searchTerm = this.searchForm.controls.searchbar.value;
    if (!searchTerm) {
      this._docsToShow = this._docs.results;
      return;
    }

    this._docsToShow = this._docs.results.filter((doc) =>
      [
        ...new Set(
          [
            doc.doc.title,
            doc.doc.docSnippet,
            doc.team?.name ?? null,
            doc.creator ? userDisplayName(doc.creator.user) : null,
            doc.maintainer ? userDisplayName(doc.maintainer.user) : null,
          ].filter(Boolean) as string[],
        ),
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }
}
