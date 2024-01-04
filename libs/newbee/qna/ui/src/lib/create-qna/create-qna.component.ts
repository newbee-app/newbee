import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  readonly alertType = AlertType;
  readonly keyword = Keyword;

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
  @Input()
  get teams(): Team[] {
    return this._teams;
  }
  set teams(teams: Team[]) {
    this._teams = teams;
    this.teamOptions = [
      new SelectOption(null, 'Entire org'),
      ...teams.map((team) => new SelectOption(team, team.name)),
    ];
  }
  private _teams: Team[] = [];

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
  questionMarkdoc = '';

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Initialize the team value with a value from the team slug param, if specified.
   */
  ngOnInit(): void {
    if (!this.teamSlugParam) {
      return;
    }

    const team = this.teams.find((team) => team.slug === this.teamSlugParam);
    if (!team) {
      return;
    }

    this.qnaForm.controls.team.setValue(team, { emitEvent: false });
  }

  /**
   * Gets the HTTP client error message for the key.
   *
   * @param keys The keys to look for.
   *
   * @returns The error message associated with the key.
   */
  httpClientErrorMsg(...keys: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, keys.join('-'));
  }

  /**
   * Whether to display a form input as having an error.
   *
   * @param inputGroup The form group to look in.
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false`otherwise.
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
