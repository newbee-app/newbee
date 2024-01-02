import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * A global service for providing what part of the document was clicked on by the user.
 * `AppComponent` provides the click targets.
 * Other apps can subscribe to the service to use the click targets as they need.
 */
@Injectable({ providedIn: 'root' })
export class ClickService implements OnDestroy {
  /**
   * The Subject which provides the document's click targets.
   */
  documentClickTarget$ = new Subject<HTMLElement>();

  /**
   * Complete all infinite observables.
   */
  ngOnDestroy(): void {
    this.documentClickTarget$.complete();
  }
}
