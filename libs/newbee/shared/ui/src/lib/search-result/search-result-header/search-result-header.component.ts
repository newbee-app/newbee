import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  postIsDoc,
  postIsQna,
  type OrgMemberUser,
  type Post,
} from '@newbee/shared/util';
import { UpToDateBtnComponent } from '../../btn';

/**
 * The dumb UI for displaying a search result's header (post title, maintainer, whether it's up-to-date).
 */
@Component({
  selector: 'newbee-search-result-header',
  standalone: true,
  imports: [CommonModule, UpToDateBtnComponent],
  templateUrl: './search-result-header.component.html',
})
export class SearchResultHeaderComponent {
  /**
   * All of the possible short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * The post the search result is about.
   */
  @Input() post!: Post;

  /**
   * The maintainer of the post.
   */
  @Input() maintainer: OrgMemberUser | null = null;

  /**
   * The creator of the post.
   */
  @Input() creator: OrgMemberUser | null = null;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Emit the `orgNavigate` output with the given paths joined by `/`.
   *
   * @param paths The paths to join.
   */
  emitOrgNavigate(...paths: string[]): void {
    this.orgNavigate.emit(`/${paths.join('/')}`);
  }

  /**
   * Navigate to the displayed post relative to the current org.
   */
  postNavigate(): void {
    if (postIsDoc(this.post)) {
      this.emitOrgNavigate(ShortUrl.Doc, this.post.slug);
    } else if (postIsQna(this.post)) {
      this.emitOrgNavigate(ShortUrl.Qna, this.post.slug);
    }
  }
}
