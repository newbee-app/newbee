import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { DocQueryResult } from '@newbee/shared/util';
import { PostSearchResultHeaderComponent } from '../header';

/**
 * The dumb UI for displaying a search result for a doc.
 */
@Component({
  selector: 'newbee-doc-search-result',
  standalone: true,
  imports: [CommonModule, PostSearchResultHeaderComponent],
  templateUrl: './doc-search-result.component.html',
})
export class DocSearchResultComponent {
  /**
   * The doc to display, including its maintainer.
   */
  @Input() doc!: DocQueryResult;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();
}
