import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { OrgForm } from '@newbee/newbee/organization/util';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import {
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
  SlugInputDirectiveModule,
} from '@newbee/newbee/shared/util';
import type { Organization, OrgMemberNoUser } from '@newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';
import { isEqual } from 'lodash-es';

/**
 * The dumb UI for editing an existing org.
 */
@Component({
  selector: 'newbee-edit-org',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
    SlugInputDirectiveModule,
  ],
  templateUrl: './edit-org.component.html',
})
export class EditOrgComponent implements OnInit {
  /**
   * The current value for the organization.
   */
  @Input() org!: Organization;

  /**
   * Information about the user in relation to the org.
   */
  @Input() orgMember: OrgMemberNoUser | null = null;

  /**
   * Whether the current value for the slug is taken.
   */
  @Input() slugTaken = false;

  /**
   * Whether to display the spinner on the edit button.
   */
  @Input() editPending = false;
  /**
   * Whether to display a spinner for the slug check.
   */
  @Input() checkPending = false;

  /**
   * Whether to display a spinner for the delete button.
   */
  @Input() deletePending = false;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The formatted value of the organization slug, only emitted after the SlugInputDirective formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted edit organization form, for use in the smart UI parent.
   */
  @Output() edit = new EventEmitter<Partial<OrgForm>>();

  /**
   * Emit to tell the smart UI parent to send a delete request.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal form to edit an existing organization.
   */
  editOrgForm = this.fb.group({
    name: [''],
    slug: [''],
  });

  /**
   * The internal form to delete an organization.
   */
  deleteOrgForm = this.fb.group({
    slug: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Whether the edit org form has at least one value distinct from the current org's values.
   */
  get editDistinct(): boolean {
    const { name, slug } = this.editOrgForm.value;
    return name !== this.org.name || slug !== this.org.slug;
  }

  /**
   * Wheter the delete org form's slug value matches the org's slug value.
   */
  get deleteSlugMatches(): boolean {
    const { slug } = this.deleteOrgForm.value;
    return slug === this.org.slug;
  }

  /**
   * Whether the org member is the owner of the organization.
   */
  get isOwner(): boolean {
    return (
      isEqual(this.orgMember?.organization, this.org) &&
      this.orgMember?.orgMember.role === OrgRoleEnum.Owner
    );
  }

  /**
   * Initialize the edit org form with the values of the current org.
   */
  ngOnInit(): void {
    this.editOrgForm.patchValue({
      name: this.org.name,
      slug: this.org.slug,
    });
  }

  /**
   * Emit the `edit` output.
   */
  emitEdit(): void {
    this.edit.emit(this.editOrgForm.value);
  }

  /**
   * Emit the `delete` output.
   */
  emitDelete(): void {
    this.delete.emit();
  }

  /**
   * Whether to display an edit org form input as having an error.
   *
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  readonly editInputDisplayError = (inputName: string): boolean =>
    inputDisplayError(this.editOrgForm, inputName) ||
    !!this.httpClientError?.messages[inputName];

  /**
   * The edit org form's input's error message.
   *
   * @param inputName The input in the edit org from to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  readonly editInputErrorMessage = (inputName: string): string =>
    getErrorMessage(this.editOrgForm.get(inputName)) ||
    (this.httpClientError?.messages[inputName] ?? '');
}
