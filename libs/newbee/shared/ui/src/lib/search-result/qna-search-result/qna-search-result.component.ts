import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { QnaQueryResult } from '@newbee/shared/util';
import { PostSearchResultHeaderComponent } from '../header';

/**
 * The dumb UI for displaying a search result for a qna.
 */
@Component({
  selector: 'newbee-qna-search-result',
  standalone: true,
  imports: [CommonModule, PostSearchResultHeaderComponent],
  templateUrl: './qna-search-result.component.html',
})
export class QnaSearchResultComponent {
  /**
   * The qna to display, including its maintainer.
   */
  @Input() qna!: QnaQueryResult;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();
}
