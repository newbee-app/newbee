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
import {
  AlertComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  DigitOnlyDirectiveModule,
  HttpClientError,
  SlugInputDirectiveModule,
  frequencySelectOptions,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  BaseUpdateOrganizationDto,
  Frequency,
  Keyword,
  OrgMemberNoUserOrg,
  OrgRoleEnum,
  durationToNumAndFreq,
  type Organization,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';

/**
 * A helper type detailing of the possible input names in the edit org component.
 */
type PossbileInputNames = 'name' | 'num' | 'frequency' | 'slug';

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
    SearchableSelectComponent,
    SlugInputDirectiveModule,
    DigitOnlyDirectiveModule,
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
  @Output() edit = new EventEmitter<BaseUpdateOrganizationDto>();

  /**
   * The emitted edit org slug form, for use in the smart UI parent.
   */
  @Output() editSlug = new EventEmitter<BaseUpdateOrganizationDto>();

  /**
   * Emit to tell the smart UI parent to send a delete request.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal form to edit an existing organization.
   */
  editOrgForm = this.fb.group({
    name: ['', [Validators.required]],
    upToDateDuration: this.fb.group({
      num: [0, [Validators.required, Validators.min(1)]],
      frequency: [Frequency.Month, [Validators.required]],
    }),
  });

  /**
   * The internal form to edit the org's slug.
   */
  editOrgSlugForm = this.fb.group({
    slug: ['', [Validators.required]],
  });

  /**
   * The internal form to delete an organization.
   */
  deleteOrgForm = this.fb.group({
    slug: ['', [Validators.required]],
  });

  /**
   * The possible frequency values as select options.
   */
  readonly frequencyOptions = frequencySelectOptions(
    this.editOrgForm.controls.upToDateDuration.controls.num,
  );

  /**
   * Set up `slug` to emit whenever the `editOrgSlugForm` changes.
   */
  constructor(private readonly fb: FormBuilder) {
    this.editOrgSlugForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (editOrgSlugForm) => {
          this.slug.emit(editOrgSlugForm.slug ?? '');
        },
      });
  }

  /**
   * The num and frequency of the input org's duration.
   */
  private get orgNumAndFreq(): { num: number; frequency: Frequency } {
    return durationToNumAndFreq(
      dayjs.duration(this.organization.upToDateDuration),
    );
  }

  /**
   * Whether the edit org form has a value distinct from the current org's values.
   */
  get editDistinct(): boolean {
    const { name, upToDateDuration } = this.editOrgForm.value;
    return (
      name !== this.organization.name ||
      this.orgNumAndFreq.num !== upToDateDuration?.num ||
      this.orgNumAndFreq.frequency !== upToDateDuration.frequency
    );
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
      {
        name: this.organization.name,
        upToDateDuration: { ...this.orgNumAndFreq },
      },
      { emitEvent: false },
    );

    this.editOrgSlugForm.setValue(
      { slug: this.organization.slug },
      { emitEvent: false },
    );
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
    const { name, upToDateDuration } = this.editOrgForm.value;
    this.edit.emit({
      ...(name && { name }),
      ...(upToDateDuration?.num &&
        upToDateDuration.frequency && {
          upToDateDuration: dayjs
            .duration(upToDateDuration.num, upToDateDuration.frequency)
            .toISOString(),
        }),
    });
  }

  /**
   * Emit the `editSlug` output.
   */
  emitEditSlug(): void {
    const { slug } = this.editOrgSlugForm.value;
    this.editSlug.emit({ slug: slug ?? '' });
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
   * @param inputGroup The input group to look at.
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(
    inputGroup: FormGroup,
    inputName: PossbileInputNames,
  ): boolean {
    return inputDisplayError(inputGroup.get(inputName));
  }

  /**
   * The input error message for the given form input.
   *
   * @param inputGroup The input group to look at.
   * @param inputName The name of the input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(
    inputGroup: FormGroup,
    inputName: PossbileInputNames,
  ): string {
    return inputErrorMessage(inputGroup.get(inputName));
  }
}
