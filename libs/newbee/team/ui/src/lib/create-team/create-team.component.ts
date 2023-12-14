import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
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
  Frequency,
  SlugInputDirectiveModule,
  formNumAndFreqToDuration,
  frequencySelectOptions,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
  type HttpClientError,
} from '@newbee/newbee/shared/util';
import {
  BaseCreateTeamDto,
  Keyword,
  type Organization,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';

/**
 * The display for creating a new team.
 */
@Component({
  selector: 'newbee-create-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    SearchableSelectComponent,
    SlugInputDirectiveModule,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './create-team.component.html',
})
export class CreateTeamComponent implements OnChanges, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly alertType = AlertType;
  readonly keyword = Keyword;

  /**
   * The orgaization we're creating a team in.
   */
  @Input() organization!: Organization;

  /**
   * The slug generated by the API based on the name.
   */
  @Input() generatedSlug = '';

  /**
   * Whether the current value for the slug is taken.
   */
  @Input() slugTaken = false;

  /**
   * Whether to display the spinner on the create button.
   */
  @Input() createPending = false;

  /**
   * Whether to display a spinner for the slug check.
   */
  @Input() checkPending = false;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The current value of the team name.
   */
  @Output() name = new EventEmitter<string>();

  /**
   * The current value of the team slug, not emitted from changes to `generatedSlug`.
   */
  @Output() slug = new EventEmitter<string>();

  /**
   * The formatted value of the team slug, only emitted after the SlugInputDirecrive formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted create team form, for use in the smart UI parent.
   */
  @Output() create = new EventEmitter<BaseCreateTeamDto>();

  /**
   * The org's duration represented as a human-readable string.
   */
  get orgDurationStr(): string {
    return dayjs.duration(this.organization.upToDateDuration).humanize();
  }

  /**
   * The internal form to create a new team.
   */
  createTeamForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    upToDateDuration: this.fb.group({
      num: [null as number | null, [Validators.min(1)]],
      frequency: [null as Frequency | null],
    }),
  });

  /**
   * The possible frequency values as select options.
   */
  readonly frequencyOptions = frequencySelectOptions(
    this.createTeamForm.controls.upToDateDuration.controls.num,
  );

  /**
   * Emits the team name and slug whenever the value changes.
   * Changes from updates to generatedSlug should not be emitted.
   */
  constructor(private readonly fb: FormBuilder) {
    this.createTeamForm.controls.name.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (name) => {
          this.name.emit(name ?? '');
        },
      });

    this.createTeamForm.controls.slug.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (slug) => {
          this.slug.emit(slug ?? '');
        },
      });
  }

  /**
   * Look out for changes to generatedSlug tand update the form value, if relevant.
   *
   * @param changes The changes to the input of the component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const generatedSlug = changes['generatedSlug'];
    if (!generatedSlug) {
      return;
    }

    this.createTeamForm.controls.slug.setValue(generatedSlug.currentValue, {
      emitEvent: false,
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
   * Emit the `create` output.
   */
  emitCreate(): void {
    const { name, slug } = this.createTeamForm.value;
    this.create.emit({
      name: name ?? '',
      slug: slug ?? '',
      upToDateDuration:
        formNumAndFreqToDuration(
          this.createTeamForm.controls.upToDateDuration.value,
        )?.toISOString() ?? null,
    });
  }

  /**
   * The misc errors, will be an empty string if there aren't any.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }

  /**
   * Whether to display the input as having an error.
   *
   * @param inputGroup The form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputGroup: FormGroup, inputName: string): boolean {
    return (
      inputDisplayError(inputGroup?.get(inputName)) ||
      !!getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * The given input's error message.
   *
   * @param inputGroup The form group to look at.
   * @param inputName The name of the form grou's input to look at.
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
