import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * The component representing the navbar.
 * Can cycle between the authenticated and unauthenticated versions depending on its inputs.
 */
@Component({
  selector: 'newbee-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  /**
   * Whether to display the authenticated navbar.
   */
  @Input() authenticated!: boolean;
}
