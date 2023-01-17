import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

/**
 * The component representing the navbar.
 * Can cycle between the authenticated and unauthenticated versions depending on its inputs.
 */
@Component({
  selector: 'newbee-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  /**
   * Whether to display the authenticated navbar.
   */
  @Input() authenticated!: boolean;
}

@NgModule({
  imports: [CommonModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarComponentModule {}
