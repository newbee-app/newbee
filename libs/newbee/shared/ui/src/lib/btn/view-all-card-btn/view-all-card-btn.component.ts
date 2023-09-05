import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

/**
 * The dumb UI for a view all card button.
 */
@Component({
  selector: 'newbee-view-all-card-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-all-card-btn.component.html',
})
export class ViewAllCardBtnComponent {
  /**
   * Indicates that the card button was clicked.
   */
  @Output() clicked = new EventEmitter<void>();
}
