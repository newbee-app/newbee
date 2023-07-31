import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditOrgForm, EditOrgSlugForm } from '@newbee/newbee/organization/util';
import { AlertComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  getHttpClientErrorMsg,
  HttpClientError,
  inputDisplayError,
  inputErrorMessage,
  SlugInputDirectiveModule,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgMemberNoUserOrg,
  OrgRoleEnum,
  type Organization,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for editing an existing org.
 */
@Component({
  selector: 'newbee-edit-org',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    SlugInputDirectiveModule,
  ],
  templateUrl: './edit-org.component.html',
})
export class EditOrgComponent implements OnInit, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * Supported alert types.
   */
  readonly alertType = AlertType;

  /**
   * Information about the org.
   */
  @Input() organization!: Organization;

  /**
   * Information about the user's relation to it.
   */
  @Input() orgMember!: OrgMemberNoUserOrg | null;

  /**
   * Whether the current value for the slug is taken.
   */
  @Input() slugTaken = false;

  /**
   * Whether to display the spinner on the edit button.
   */
  @Input() editPending = false;

  /**
   * Whether to display the spinner on the edit slug button.
   */
  @Input() editSlugPending = false;

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
   * The current value of the organization slug.
   */
  @Output() slug = new EventEmitter<string>();

  /**
   * The formatted value of the organization slug, only emitted after the SlugInputDirective formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted edit organization form, for use in the smart UI parent.
   */
  @Output() edit = new EventEmitter<Partial<EditOrgForm>>();

  /**
   * The emitted edit org slug form, for use in the smart UI parent.
   */
  @Output() editSlug = new EventEmitter<Partial<EditOrgSlugForm>>();

  /**
   * Emit to tell the smart UI parent to send a delete request.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal form to edit an existing organization.
   */
  editOrgForm = this.fb.group({
    name: ['', Validators.required],
  });

  /**
   * The internal form to edit the org's slug.
   */
  editOrgSlugForm = this.fb.group({
    slug: ['', Validators.required],
  });

  /**
   * The internal form to delete an organization.
   */
  deleteOrgForm = this.fb.group({
    slug: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Whether the edit org form has a value distinct from the current org's values.
   */
  get editDistinct(): boolean {
    const { name } = this.editOrgForm.value;
    return name !== this.organization.name;
  }

  /**
   * Whether the edit org slug form has a value distinct from the current org's slug.
   */
  get editSlugDistinct(): boolean {
    const { slug } = this.editOrgSlugForm.value;
    return slug !== this.organization.slug;
  }

  /**
   * Wheter the delete org form's slug value matches the org's slug value.
   */
  get deleteSlugMatches(): boolean {
    const { slug } = this.deleteOrgForm.value;
    return slug === this.organization.slug;
  }

  /**
   * Whether the org member is the owner of the organization.
   */
  get isOwner(): boolean {
    return this.orgMember?.orgMember.role === OrgRoleEnum.Owner;
  }

  /**
   * Initialize the edit org form with the values of the current org.
   */
  ngOnInit(): void {
    this.editOrgForm.setValue(
      { name: this.organization.name },
      { emitEvent: false }
    );
    this.editOrgSlugForm.setValue(
      { slug: this.organization.slug },
      { emitEvent: false }
    );

    this.editOrgSlugForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (editOrgSlugForm) => {
          this.slug.emit(editOrgSlugForm.slug ?? '');
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Emit the `edit` output.
   */
  emitEdit(): void {
    this.edit.emit(this.editOrgForm.value);
  }

  /**
   * Emit the `editSlug` output.
   */
  emitEditSlug(): void {
    this.editSlug.emit(this.editOrgSlugForm.value);
  }

  /**
   * Emit the `delete` output.
   */
  emitDelete(): void {
    this.delete.emit();
  }

  /**
   * Get the error message associated with the key.
   *
   * @param key The key to find the error message.
   *
   * @returns The error message associated with the key, an empty string if there isn't one.
   */
  httpClientErrorMsg(...key: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, key.join('-'));
  }

  /**
   * Whether to display a form input as having an error.
   *
   * @param formName The name of the form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(
    formName: 'editOrg' | 'editOrgSlug' | 'deleteOrg',
    inputName: string
  ): boolean {
    const form = this.getFormGroup(formName);
    return inputDisplayError(form, inputName);
  }

  /**
   * The input error message for the given form.
   *
   * @param formName The name of the form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(
    formName: 'editOrg' | 'editOrgSlug' | 'deleteOrg',
    inputName: string
  ): string {
    const form = this.getFormGroup(formName);
    return inputErrorMessage(form.get(inputName));
  }

  /**
   * Get the form group associated with the given name.
   *
   * @param formName The name of the form group to get.
   *
   * @returns The form group associated with the given name.
   */
  private getFormGroup(
    formName: 'editOrg' | 'editOrgSlug' | 'deleteOrg'
  ): FormGroup {
    switch (formName) {
      case 'editOrg':
        return this.editOrgForm;
      case 'editOrgSlug':
        return this.editOrgSlugForm;
      case 'deleteOrg':
        return this.deleteOrgForm;
    }
  }
}
