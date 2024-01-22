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
  HttpClientError,
  IsVisibleDirectiveModule,
  OrgMemberPostTab,
  SearchResultFormat,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
import {
  DocQueryResult,
  Keyword,
  PaginatedResults,
  QnaQueryResult,
  resultIsDocQueryResult,
  userDisplayName,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';
import { AlertComponent } from '../alert';
import { SearchbarComponent } from '../form-control';
import { SearchResultComponent } from '../search-result';

/**
 * The dumb UI for viewing a paginated set of posts.
 */
@Component({
  selector: 'newbee-view-posts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IsVisibleDirectiveModule,
    SearchbarComponent,
    SearchResultComponent,
    AlertComponent,
  ],
  templateUrl: './view-posts.component.html',
})
export class ViewPostsComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchResultFormat = SearchResultFormat;
  readonly orgMemberPostTabs = Object.entries(OrgMemberPostTab);

  /**
   * The HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * Whether we are currently displaying docs or qnas.
   */
  @Input() postType!: 'doc' | 'qna';

  /**
   * The post type properly formatted for display.
   */
  get formattedPostType(): string {
    return this.postType === 'doc' ? 'doc' : 'QnA';
  }

  /**
   * The tab the user is looking at, if this page is displaying an org member's posts.
   */
  @Input() orgMemberTab: OrgMemberPostTab | null = null;

  /**
   * Emits whenever the org member tab value changes.
   */
  @Output() orgMemberTabChange = new EventEmitter<OrgMemberPostTab | null>();

  /**
   * The posts of the org.
   */
  @Input()
  get posts(): PaginatedResults<DocQueryResult | QnaQueryResult> | null {
    return this._posts;
  }
  set posts(posts: PaginatedResults<DocQueryResult | QnaQueryResult> | null) {
    this._posts = posts;
    this.updatePostsToShow();
  }
  private _posts: PaginatedResults<DocQueryResult | QnaQueryResult> | null =
    null;

  /**
   * Whether more posts are being fetched.
   */
  @Input() getPostsPending = false;

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Emits whenver the user fires a search request.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Indicates that more posts should be fetched.
   */
  @Output() continueSearch = new EventEmitter<void>();

  /**
   * The form containing the searchbar.
   */
  readonly searchForm = this.fb.group({ searchbar: '' });

  /**
   * The subset of the posts to show to the user.
   */
  get postsToShow(): (DocQueryResult | QnaQueryResult)[] {
    return this._postsToShow;
  }
  private _postsToShow: (DocQueryResult | QnaQueryResult)[] = [];

  /**
   * Update the posts to show using the current searchbar value.
   */
  constructor(private readonly fb: FormBuilder) {
    this.searchForm.controls.searchbar.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.updatePostsToShow();
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
   * The number of posts that were found, expressed as a string.
   */
  get postsFound(): string {
    if (!this._posts) {
      return `No ${this.formattedPostType}s found`;
    }

    return `${this._posts.total} ${this.formattedPostType}${
      this._posts.total === 1 ? '' : 's'
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
   * Change the current org member tab to the new value.
   *
   * @param tab The new value for the org member tab.
   */
  changeOrgMemberTab(tab: OrgMemberPostTab): void {
    if (this.orgMemberTab === tab) {
      return;
    }

    this.orgMemberTab = tab;
    this.orgMemberTabChange.emit(tab);
  }

  /**
   * Update `postsToShow` to filter using the current search term.
   */
  private updatePostsToShow(): void {
    if (!this._posts) {
      this._postsToShow = [];
      return;
    }

    const searchTerm = this.searchForm.controls.searchbar.value;
    if (!searchTerm) {
      this._postsToShow = this._posts.results;
      return;
    }

    this._postsToShow = this._posts.results.filter((post) => {
      const fieldsToCheck = [
        post.team?.name ?? null,
        post.creator ? userDisplayName(post.creator.user) : null,
        post.maintainer ? userDisplayName(post.maintainer.user) : null,
      ];
      if (resultIsDocQueryResult(post)) {
        fieldsToCheck.push(...[post.doc.title, post.doc.docSnippet]);
      } else {
        fieldsToCheck.push(
          ...[post.qna.title, post.qna.questionSnippet, post.qna.answerSnippet],
        );
      }

      const lcSearchTerm = searchTerm.toLowerCase();
      return [...new Set(fieldsToCheck.filter(Boolean) as string[])].some(
        (field) => field.toLowerCase().includes(lcSearchTerm),
      );
    });
  }
}
