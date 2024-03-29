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
  NumAndFreqInputComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  DigitOnlyDirectiveModule,
  HttpClientError,
  NumAndFreq,
  NumAndFreqInput,
  SlugInputDirectiveModule,
  durationToNumAndFreq,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
  numAndFreqInputToDuration,
  numAndFreqIsDistinct,
} from '@newbee/newbee/shared/util';
import {
  BaseUpdateTeamDto,
  Keyword,
  apiRoles,
  checkRoles,
  type OrgMember,
  type Organization,
  type Team,
  type TeamMember,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for editing an existing team.
 */
@Component({
  selector: 'newbee-edit-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    NumAndFreqInputComponent,
    SlugInputDirectiveModule,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './edit-team.component.html',
})
export class EditTeamComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly keyword = Keyword;
  readonly alertType = AlertType;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;

  /**
   * The organization the team belongs to.
   */
  @Input() organization!: Organization;

  /**
   * Information about the selected team.
   */
  @Input() team!: Team;

  /**
   * Information about the requester's role in the org.
   */
  @Input() orgMember!: OrgMember;

  /**
   * Information about the requester's role in the team.
   */
  @Input() teamMember: TeamMember | null = null;

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
   * HTTP client error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The current value of the team slug.
   */
  @Output() slug = new EventEmitter<string>();

  /**
   * The formatted value of the team slug, only emitted after the SlugInputDirective formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted edit team form, for use in the smart UI parent.
   */
  @Output() edit = new EventEmitter<BaseUpdateTeamDto>();

  /**
   * The emitted edit team slug form, for use in the smart UI parent.
   */
  @Output() editSlug = new EventEmitter<string>();

  /**
   * Emit to tell the smart UI parent to send a delete request.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal form to edit an existing team.
   */
  editTeamForm = this.fb.group({
    name: ['', Validators.required],
    upToDateDuration: [{ num: null, frequency: null } as NumAndFreqInput],
  });

  /**
   * The internal form to edit the team's slug.
   */
  editTeamSlugForm = this.fb.group({
    slug: ['', Validators.required],
  });

  /**
   * The internal form to delete a team.
   */
  deleteTeamForm = this.fb.group({
    slug: ['', Validators.required],
  });

  /**
   * Emit the team slug whenever the value changes.
   */
  constructor(private readonly fb: FormBuilder) {
    this.editTeamSlugForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (editTeamSlugForm) => {
          this.slug.emit(editTeamSlugForm.slug ?? '');
        },
      });
  }

  /**
   * Whether the edit team form has a value distinct from the current team's values.
   */
  get editDistinct(): boolean {
    const { name } = this.editTeamForm.value;
    return (
      name !== this.team.name ||
      numAndFreqIsDistinct(
        this.teamNumAndFreq,
        this.editTeamForm.controls.upToDateDuration.value,
      )
    );
  }

  /**
   * Whether the edit team slug form has a value distinct from the current team's slug.
   */
  get editSlugDistinct(): boolean {
    const { slug } = this.editTeamSlugForm.value;
    return slug !== this.team.slug;
  }

  /**
   * Whether the delete team form's slug value matches the team's slug value.
   */
  get deleteSlugMatches(): boolean {
    const { slug } = this.deleteTeamForm.value;
    return slug === this.team.slug;
  }

  /**
   * The org's duration represented as a human-readable string.
   */
  get orgDurationStr(): string {
    return dayjs.duration(this.organization.upToDateDuration).humanize();
  }

  /**
   * The team's up-to-date duration, represented as a num and frequency.
   */
  private get teamNumAndFreq(): NumAndFreq | null {
    return !this.team.upToDateDuration
      ? null
      : durationToNumAndFreq(dayjs.duration(this.team.upToDateDuration));
  }

  /**
   * Initialize the edit team form with the values of the current team.
   */
  ngOnInit(): void {
    this.editTeamForm.setValue(
      {
        name: this.team.name,
        upToDateDuration: this.teamNumAndFreq ?? { num: null, frequency: null },
      },
      { emitEvent: false },
    );
    this.editTeamSlugForm.setValue(
      { slug: this.team.slug },
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
    const { name } = this.editTeamForm.value;
    this.edit.emit({
      name: name ?? '',
      upToDateDuration:
        numAndFreqInputToDuration(
          this.editTeamForm.controls.upToDateDuration.value,
        )?.toISOString() ?? null,
    });
  }

  /**
   * Emit the `editSlug` output.
   */
  emitEditSlug(): void {
    this.editSlug.emit(this.editTeamSlugForm.value.slug ?? '');
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
   * @param inputGroup The form group to look in.
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputGroup: FormGroup, inputName: string): boolean {
    return (
      inputDisplayError(inputGroup.get(inputName)) ||
      !!getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * The input error message for the given form input.
   *
   * @param inputGroup The form group to look in.
   * @param inputName The name of the input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputGroup: FormGroup, inputName: string): string {
    return (
      inputErrorMessage(inputGroup.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }
}
