import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertComponent,
  MarkdocEditorComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  SelectOption,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import { BaseCreateQnaDto, Keyword, Team } from '@newbee/shared/util';

/**
 * A dumb UI for creating a new qna.
 */
@Component({
  selector: 'newbee-create-qna',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    AlertComponent,
    MarkdocEditorComponent,
  ],
  templateUrl: './create-qna.component.html',
})
export class CreateQnaComponent implements OnInit {
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
   * All of the teams of the org the question can be asked to.
   */
  @Input() teams: Team[] = [];

  /**
   * The query param representing a team slug, if one is specified.
   */
  @Input() teamSlugParam: string | null = null;

  /**
   * Tells the smart UI parent when the QnA is ready to be created.
   */
  @Output() create = new EventEmitter<BaseCreateQnaDto>();

  /**
   * The form containing the QnA's title and team.
   */
  qnaForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
  });

  /**
   * The question markdoc as a string, for internal tracking.
   */
  private questionMarkdoc = '';

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Initialize the team options and the team value with a value from the team slug param, if specified.
   */
  ngOnInit(): void {
    this.teamOptions = [
      new SelectOption(null, 'Entire org'),
      ...this.teams.map((team) => new SelectOption(team, team.name)),
    ];

    if (!this.teamSlugParam) {
      return;
    }

    const team = this.teams.find((team) => team.slug === this.teamSlugParam);
    if (!team) {
      return;
    }

    this.qnaForm.controls.team.setValue(team);
  }

  /**
   * Whether to show the title control's error message.
   */
  get showTitleError(): boolean {
    return (
      inputDisplayError(this.qnaForm.controls.title) ||
      !!getHttpClientErrorMsg(this.httpClientError, 'title')
    );
  }

  /**
   * The title control's error message, if it has one.
   * Will be an empty string if it doesn't.
   */
  get titleErrorMessage(): string {
    return (
      inputErrorMessage(this.qnaForm.controls.title) ||
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
   * Update the internal question markdoc value whenever the text changes.
   *
   * @param textMarkdoc The new value for question markdoc.
   */
  onTextChange(textMarkdoc: string): void {
    this.questionMarkdoc = textMarkdoc;
  }

  /**
   * Called to emit the create output based off of the UI's values.
   */
  emitCreate(): void {
    const { title, team } = this.qnaForm.value;
    this.create.emit({
      title: title ?? '',
      questionMarkdoc: this.questionMarkdoc || null,
      answerMarkdoc: null,
      team: team?.slug ?? null,
    });
  }
}
