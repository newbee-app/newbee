import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertComponent,
  MarkdocEditorComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import { BaseCreateQnaDto } from '@newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';

/**
 * A dumb UI for creating a new doc.
 */
@Component({
  selector: 'newbee-create-qna',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    MarkdocEditorComponent,
  ],
  templateUrl: './create-qna.component.html',
})
export class CreateQnaComponent {
  /**
   * All valid alert types.
   */
  readonly alertType = AlertType;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * Whether to display the spinner on the create button.
   */
  @Input() createPending = false;

  /**
   * Tells the smart UI parent when the QnA is ready to be created.
   */
  @Output() create = new EventEmitter<BaseCreateQnaDto>();

  /**
   * The form containing the QnA's title.
   */
  qnaTitle = this.fb.group({
    title: ['', [Validators.required]],
  });

  /**
   * The question markdoc as a string, for internal tracking.
   */
  private questionMarkdoc = '';

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Whether to show the title control's error message.
   */
  get showTitleError(): boolean {
    return (
      inputDisplayError(this.qnaTitle.controls.title) ||
      !!getHttpClientErrorMsg(this.httpClientError, 'title')
    );
  }

  /**
   * The title control's error message, if it has one.
   * Will be an empty string if it doesn't.
   */
  get titleErrorMessage(): string {
    return (
      inputErrorMessage(this.qnaTitle.controls.title) ||
      getHttpClientErrorMsg(this.httpClientError, 'title')
    );
  }

  /**
   * The misc errors, will be an empty string if there aren't any.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }

  /**
   * Update the internal question markdoc value whenever the content changes.
   *
   * @param content The new value for question markdoc.
   */
  onContent(content: string): void {
    this.questionMarkdoc = content;
  }

  /**
   * Called to emit a `BaseCreateQnaDto` based off of the UI's values.
   */
  emitCreate(): void {
    const createQnaDto: BaseCreateQnaDto = {
      title: this.qnaTitle.controls.title.value ?? '',
      questionMarkdoc: this.questionMarkdoc || null,
      answerMarkdoc: null,
    };
    this.create.emit(createQnaDto);
  }
}
