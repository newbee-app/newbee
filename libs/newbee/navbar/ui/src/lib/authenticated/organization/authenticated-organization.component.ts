import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent } from '@newbee/newbee/shared/ui';
import { SelectOption } from '@newbee/newbee/shared/util';

/**
 * The left-hand side of the authenticated navbar, which allows the user to select which organization they're looking at.
 */
@Component({
  selector: 'newbee-authenticated-organization',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './authenticated-organization.component.html',
})
export class AuthenticatedOrganizationComponent {
  /**
   * All of the organizations the user is a part of.
   */
  @Input() organizations!: SelectOption<string>[];

  /**
   * The organization the user is currently looking at.
   */
  @Input() selectedOrganization!: SelectOption<string>;

  /**
   * An emitter telling the parent component which category has been selected.
   */
  @Output() selectedOrganizationChange = new EventEmitter<
    SelectOption<string>
  >();

  /**
   * Selects the given value as the selected organization and emits it.
   *
   * @param value The value of the selected option.
   */
  selectOption(value: string): void {
    const selectedOrganization = this.organizations.find(
      (option) => option.value === value
    );
    if (!selectedOrganization) {
      return;
    }

    this.selectedOrganizationChange.emit(selectedOrganization);
  }
}
