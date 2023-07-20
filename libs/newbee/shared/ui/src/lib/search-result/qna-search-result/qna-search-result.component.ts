import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { QnaMembers } from '@newbee/shared/util';
import { SearchResultHeaderComponent } from '../search-result-header';

/**
 * The dumb UI for displaying a search result for a qna.
 */
@Component({
  selector: 'newbee-qna-search-result',
  standalone: true,
  imports: [CommonModule, SearchResultHeaderComponent],
  templateUrl: './qna-search-result.component.html',
})
export class QnaSearchResultComponent {
  /**
   * The qna to display, including its maintainer.
   */
  @Input() qna!: QnaMembers;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();
}
