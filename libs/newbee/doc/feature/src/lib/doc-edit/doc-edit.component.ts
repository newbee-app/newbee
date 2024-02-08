import { Component } from '@angular/core';
import { docFeature as docModuleFeature } from '@newbee/newbee/doc/data-access';
import {
  DocActions,
  docFeature,
  httpFeature,
  organizationFeature,
  selectOrgMemberUser,
} from '@newbee/newbee/shared/data-access';
import { UpdateDocDto } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for editing a doc.
 */
@Component({
  selector: 'newbee-doc-edit',
  templateUrl: './doc-edit.component.html',
})
export class DocEditComponent {
  /**
   * HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * The doc state.
   */
  docState$ = this.store.select(docFeature.selectDocState);

  /**
   * The org member and user.
   */
  orgMemberUser$ = this.store.select(selectOrgMemberUser);

  /**
   * The selected organization.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization,
  );

  /**
   * The doc module state.
   */
  docModuleState$ = this.store.select(docModuleFeature.selectDocModuleState);

  constructor(private readonly store: Store) {}

  /**
   * Dispatch editDoc with the given details when the dumb UI emits.
   *
   * @param updateDocDto The new details for the currently selected doc.
   */
  onEdit(updateDocDto: UpdateDocDto): void {
    this.store.dispatch(DocActions.editDoc({ updateDocDto }));
  }

  /**
   * Dispatch markDocAsUpToDate when the dumb UI emits.
   */
  onMarkAsUpToDate(): void {
    this.store.dispatch(DocActions.markDocAsUpToDate());
  }

  /**
   * Dispatch deleteDoc when the dumb UI emits.
   */
  onDelete(): void {
    this.store.dispatch(DocActions.deleteDoc());
  }
}
