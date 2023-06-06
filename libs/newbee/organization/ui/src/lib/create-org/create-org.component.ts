import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { CreateOrgForm } from '@newbee/newbee/organization/util';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import {
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
} from '@newbee/newbee/shared/util';

@Component({
  selector: 'newbee-create-org',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './create-org.component.html',
})
export class CreateOrgComponent {
  /**
   * Whether to display the spinner on the create button.
   */
  @Input() createPending!: boolean;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted create organization form, for use in the smart UI parent.
   */
  @Output() create = new EventEmitter<Partial<CreateOrgForm>>();

  /**
   * The internal form to create a new organization.
   */
  createOrgForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: [''],
  });

  constructor(private readonly fb: FormBuilder) {}

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
    !!this.httpClientError?.messages?.[inputName];

  /**
   * The given input's error message.
   *
   * @param inputName The name of the form grou's input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputName: string): string {
    return (
      getErrorMessage(this.createOrgForm.get(inputName)) ||
      (this.httpClientError?.messages?.[inputName] ?? '')
    );
  }
}
