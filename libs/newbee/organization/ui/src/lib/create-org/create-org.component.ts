import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { OrgForm } from '@newbee/newbee/organization/util';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import {
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
  SlugInputDirectiveModule,
} from '@newbee/newbee/shared/util';
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
    ErrorAlertComponent,
    SlugInputDirectiveModule,
  ],
  templateUrl: './create-org.component.html',
})
export class CreateOrgComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

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
  @Output() create = new EventEmitter<Partial<OrgForm>>();

  /**
   * The internal form to create a new organization.
   */
  createOrgForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Emit the org name and slug whenever the value changes.
   * Changes from updates to generatedSlug should not be emitted.
   */
  ngOnInit(): void {
    this.createOrgForm
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (name) => {
          this.name.emit(name ?? '');
        },
      });

    this.createOrgForm
      .get('slug')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
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

    this.createOrgForm
      .get('slug')
      ?.setValue(generatedSlug.currentValue, { emitEvent: false });
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
    this.create.emit(this.createOrgForm.value);
  }

  /**
   * Whether to display the input as having an error.
   *
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  readonly inputDisplayError = (inputName: string): boolean =>
    inputDisplayError(this.createOrgForm, inputName) ||
    !!this.httpClientError?.messages[inputName];

  /**
   * The given input's error message.
   *
   * @param inputName The name of the form grou's input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  readonly inputErrorMessage = (inputName: string): string =>
    getErrorMessage(this.createOrgForm.get(inputName)) ||
    (this.httpClientError?.messages[inputName] ?? '');
}
