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
  HttpClientError,
  SlugInputDirectiveModule,
  frequencySelectOptions,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  BaseCreateOrganizationDto,
  Frequency,
  Keyword,
  nbDayjs,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The display for creating a new org.
 */
@Component({
  selector: 'newbee-create-org',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    SlugInputDirectiveModule,
    DigitOnlyDirectiveModule,
    SearchableSelectComponent,
  ],
  templateUrl: './create-org.component.html',
})
export class CreateOrgComponent implements OnChanges, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Supported alert types.
   */
  readonly alertType = AlertType;

  /**
   * NewBee keywords.
   */
  readonly keyword = Keyword;

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
   * The current value of the organization name.
   */
  @Output() name = new EventEmitter<string>();

  /**
   * The current value of the organization slug, not emitted from changes to `generatedSlug`.
   */
  @Output() slug = new EventEmitter<string>();

  /**
   * The formatted value of the organization slug, only emitted after the SlugInputDirective formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted create organization form, for use in the smart UI parent.
   */
  @Output() create = new EventEmitter<BaseCreateOrganizationDto>();

  /**
   * The initial value for the up-to-date duration.
   */
  private static readonly initialDuration = {
    num: 6,
    frequency: Frequency.Month,
  };

  /**
   * The internal form to create a new organization.
   */
  readonly createOrgForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    upToDateDuration: this.fb.group({
      num: [
        CreateOrgComponent.initialDuration.num,
        [Validators.required, Validators.min(1)],
      ],
      frequency: [
        CreateOrgComponent.initialDuration.frequency,
        [Validators.required],
      ],
    }),
  });

  /**
   * The possible frequency values as select options.
   */
  readonly frequencyOptions = frequencySelectOptions(
    this.createOrgForm.controls.upToDateDuration.controls.num,
  );

  /**
   * Emit the org name and slug whenever the value changes.
   * Changes from updates to generatedSlug should not be emitted.
   */
  constructor(private readonly fb: FormBuilder) {
    this.createOrgForm.controls.name.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (name) => {
          this.name.emit(name ?? '');
        },
      });

    this.createOrgForm.controls.slug.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (slug) => {
          this.slug.emit(slug ?? '');
        },
      });
  }

  /**
   * Look out for changes to generatedSlug and update the form value, if relevant.
   *
   * @param changes The changes to the input of the component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const generatedSlug = changes['generatedSlug'];
    if (!generatedSlug) {
      return;
    }

    this.createOrgForm.controls.slug.setValue(generatedSlug.currentValue, {
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
    const { name, slug, upToDateDuration } = this.createOrgForm.value;
    const num = upToDateDuration?.num ?? CreateOrgComponent.initialDuration.num;
    const frequency =
      upToDateDuration?.frequency ??
      CreateOrgComponent.initialDuration.frequency;

    const createOrganizationDto: BaseCreateOrganizationDto = {
      name: name ?? '',
      slug: slug ?? '',
      upToDateDuration: nbDayjs.duration(num, frequency).toISOString(),
    };
    this.create.emit(createOrganizationDto);
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
   * @param inputName The name of the form group's input to look at.
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
   * The given input's error message.
   *
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
