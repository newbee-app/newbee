import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

/**
 * A dumb UI for a simple "view all" button.
 */
@Component({
  selector: 'newbee-view-all-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-all-btn.component.html',
})
export class ViewAllBtnComponent {
  /**
   * Indicates that the view all button was clicked.
   */
  @Output() clicked = new EventEmitter<void>();
}
