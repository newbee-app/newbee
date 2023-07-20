import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { OrgMemberUser, Post } from '@newbee/shared/util';
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
   * The post the search result is about.
   */
  @Input() post!: Post;

  /**
   * The maintainer of the post.
   */
  @Input() maintainer!: OrgMemberUser;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();
}
