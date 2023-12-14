import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { docFeature as docModuleFeature } from '@newbee/newbee/doc/data-access';
import {
  DocActions,
  docFeature,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing a doc.
 */
@Component({
  selector: 'newbee-doc-view',
  templateUrl: './doc-view.component.html',
})
export class DocViewComponent {
  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The doc state.
   */
  docState$ = this.store.select(docFeature.selectDocState);

  /**
   * The current user's role in the doc's org, if any.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * Whether the mark as up-to-date action is pending.
   */
  pendingUpToDate$ = this.store.select(docModuleFeature.selectPendingUpToDate);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Navigate to a path relative to the current org.
   *
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../${path}`], { relativeTo: this.route });
  }

  /**
   * Navigate to a path relative to the current doc.
   *
   * @param path The path to navigate to.
   */
  async onDocNavigate(path: string): Promise<void> {
    await this.router.navigate([`./${path}`], { relativeTo: this.route });
  }

  /**
   * Mark the currently selected doc as up-to-date.
   */
  onMarkAsUpToDate(): void {
    this.store.dispatch(DocActions.markDocAsUpToDate());
  }
}
