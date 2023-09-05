import { CommonModule } from '@angular/common';
import { Component, ContentChild } from '@angular/core';
import { Router } from '@angular/router';
import { httpFeature } from '@newbee/newbee/shared/data-access';
import {
  ForbiddenErrorComponent,
  InternalServerErrorComponent,
  NotFoundErrorComponent,
} from '@newbee/newbee/shared/ui';
import { TemplateMarkerDirective } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the error screen, which will display an error if there is one, or the specified content otherwise.
 */
@Component({
  selector: 'newbee-error-screen',
  standalone: true,
  imports: [
    CommonModule,
    ForbiddenErrorComponent,
    InternalServerErrorComponent,
    NotFoundErrorComponent,
  ],
  templateUrl: './error-screen.component.html',
})
export class ErrorScreenComponent {
  /**
   * The conditionally projected content to display when there's no error.
   */
  @ContentChild(TemplateMarkerDirective) content!: TemplateMarkerDirective;

  /**
   * HTTP screen error, if any exist.
   */
  httpScreenError$ = this.store.select(httpFeature.selectScreenError);

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * When the dumb UI emits a request to navigate home, pass it to the router.
   */
  async onNavigateHome(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
