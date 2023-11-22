import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  userHasAnswerPermissions,
  userHasDeletePermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/qna/util';
import {
  AlertComponent,
  MarkdocEditorComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  DigitOnlyDirectiveModule,
  Frequency,
  HttpClientError,
  NumAndFreq,
  SelectOption,
  defaultUpToDateDuration,
  durationToNumAndFreq,
  formNumAndFreqToDuration,
  frequencySelectOptions,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
  numAndFreqIsDistinct,
} from '@newbee/newbee/shared/util';
import {
  BaseUpdateAnswerDto,
  BaseUpdateQuestionDto,
  Keyword,
  Team,
  TeamMember,
  type OrgMember,
  type Organization,
  type QnaNoOrg,
} from '@newbee/shared/util';
import dayjs from 'dayjs';

/**
 * A dumb UI for editing a qna.
 */
@Component({
  selector: 'newbee-edit-qna',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    AlertComponent,
    MarkdocEditorComponent,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './edit-qna.component.html',
})
export class EditQnaComponent implements OnInit {
  readonly alertType = AlertType;
  readonly keyword = Keyword;

  /**
   * The form containing the qna's title and team.
   */
  editQuestionForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
  });

  /**
   * The form containing the qna's up-to-date duration.
   */
  editAnswerForm = this.fb.group({
    upToDateDuration: this.fb.group({
      num: [null as null | number, [Validators.min(0)]],
      frequency: [null as null | Frequency],
    }),
  });

  readonly frequencyOptions = frequencySelectOptions(
    this.editAnswerForm.controls.upToDateDuration.controls.num,
  );

  /**
   * The question markdoc as a string, for internal tracking.
   */
  questionMarkdoc = '';

  /**
   * The answer markdoc as a string, for internal tracking.
   */
  answerMarkdoc = '';

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The qna to edit.
   */
  @Input() qna!: QnaNoOrg;

  /**
   * The user's role in the qna's org.
   */
  @Input() orgMember!: OrgMember;

  /**
   * The user's role in the qna's team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * All of the teams of the org the question can be asked to.
   */
  @Input() teams: Team[] = [];

  /**
   * The organization the qna is in.
   */
  @Input() organization!: Organization;

  /**
   * Whether the edit question action is pending.
   */
  @Input() editQuestionPending = false;

  /**
   * Whether the edit answer action is pending.
   */
  @Input() editAnswerPending = false;

  /**
   * Whether the up-to-date action is pending.
   */
  @Input() upToDatePending = false;

  /**
   * Whether the delete action is pending.
   */
  @Input() deletePending = false;

  /**
   * Tells the smart UI parent to update the question with the given values.
   */
  @Output() editQuestion = new EventEmitter<BaseUpdateQuestionDto>();

  /**
   * Tells the smart UI parent to update the answer with the given value.
   */
  @Output() editAnswer = new EventEmitter<BaseUpdateAnswerDto>();

  /**
   * Tells the smart UI parent to mark the qna as up-to-date.
   */
  @Output() markAsUpToDate = new EventEmitter<void>();

  /**
   * Tells the smart UI parent to delete the qna.
   */
  @Output() delete = new EventEmitter<void>();

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Initialize the values of questionMarkdoc, answerMarkdoc, and editQuestionForm with the input qna.
   */
  ngOnInit(): void {
    if (this.hasQuestionPermissions) {
      this.questionMarkdoc = this.qna.qna.questionMarkdoc ?? '';
      this.teamOptions = [
        new SelectOption(null, 'Entire org'),
        ...this.teams.map((team) => new SelectOption(team, team.name)),
      ];

      this.editQuestionForm.setValue(
        { title: this.qna.qna.title, team: this.qna.team },
        { emitEvent: false },
      );
    }

    if (this.hasAnswerPermissions) {
      this.answerMarkdoc = this.qna.qna.answerMarkdoc ?? '';

      this.editAnswerForm.setValue({
        upToDateDuration: this.qnaNumAndFreq ?? {
          num: null,
          frequency: null,
        },
      });
    }
  }

  /**
   * Whether the user has question permissions.
   */
  get hasQuestionPermissions(): boolean {
    return userHasQuestionPermissions(
      this.qna,
      this.orgMember,
      this.teamMember,
    );
  }

  /**
   * Whether the user has answer permissions.
   */
  get hasAnswerPermissions(): boolean {
    return userHasAnswerPermissions(this.qna, this.orgMember, this.teamMember);
  }

  /**
   * Whether the user has up-to-date permissions.
   */
  get hasUpToDatePermissions(): boolean {
    return userHasUpToDatePermissions(
      this.qna,
      this.orgMember,
      this.teamMember,
    );
  }

  /**
   * Whether the user has delete permissions.
   */
  get hasDeletePermissions(): boolean {
    return userHasDeletePermissions(this.qna, this.orgMember, this.teamMember);
  }

  /**
   * Whether to show quick actions.
   */
  get showQuickActions(): boolean {
    return this.hasUpToDatePermissions || this.hasDeletePermissions;
  }

  /**
   * What to display for the up-to-date duration tagline.
   */
  get defaultUpToDateDuration(): string {
    return defaultUpToDateDuration(this.organization, this.qna.team);
  }

  /**
   * Whether the edit question portion is distinct from the current qna.
   */
  get editQuestionDistinct(): boolean {
    const { team, title } = this.editQuestionForm.value;
    return (
      team !== this.qna.team ||
      title !== this.qna.qna.title ||
      this.questionMarkdoc !== this.qna.qna.questionMarkdoc
    );
  }

  /**
   * Whether the edit answer portion is distinct from the current qna.
   */
  get editAnswerDistinct(): boolean {
    return (
      this.answerMarkdoc !== this.qna.qna.answerMarkdoc ||
      numAndFreqIsDistinct(
        this.qnaNumAndFreq,
        this.editAnswerForm.controls.upToDateDuration.value,
      )
    );
  }

  /**
   * The qna's up-to-date duration, as a num and frequency.
   */
  private get qnaNumAndFreq(): NumAndFreq | null {
    return this.qna.qna.upToDateDuration
      ? durationToNumAndFreq(dayjs.duration(this.qna.qna.upToDateDuration))
      : null;
  }

  /**
   * Emit a request to edit the qna's question.
   */
  emitEditQuestion(): void {
    const { title, team } = this.editQuestionForm.value;
    this.editQuestion.emit({
      title: title ?? '',
      questionMarkdoc: this.questionMarkdoc || null,
      team: team?.slug ?? null,
    });
  }

  /**
   * Emit a request to edit the qna's answer.
   */
  emitEditAnswer(): void {
    this.editAnswer.emit({
      answerMarkdoc: this.answerMarkdoc,
      upToDateDuration:
        formNumAndFreqToDuration(
          this.editAnswerForm.controls.upToDateDuration.value,
        )?.toISOString() ?? null,
    });
  }

  /**
   * Gets the HTTP client error message for the key.
   *
   * @param keys The key to look for.
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
