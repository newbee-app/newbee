import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * A dumb UI for displaying a 404 not found error.
 */
@Component({
  selector: 'newbee-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
