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
  NumAndFreqInputComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  DigitOnlyDirectiveModule,
  HttpClientError,
  NumAndFreq,
  NumAndFreqInput,
  SelectOption,
  defaultUpToDateDuration,
  durationToNumAndFreq,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
  numAndFreqInputToDuration,
  numAndFreqIsDistinct,
} from '@newbee/newbee/shared/util';
import {
  BaseUpdateAnswerDto,
  BaseUpdateQuestionDto,
  Keyword,
  RoleType,
  Team,
  TeamMember,
  apiRoles,
  checkRoles,
  userDisplayName,
  type OrgMemberUser,
  type Organization,
  type QnaNoOrg,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';

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
    NumAndFreqInputComponent,
    AlertComponent,
    MarkdocEditorComponent,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './edit-qna.component.html',
})
export class EditQnaComponent implements OnInit {
  readonly alertType = AlertType;
  readonly keyword = Keyword;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;

  /**
   * Up-to-date and delete role permissions.
   */
  readonly upToDateAndDeleteRoles = new Set(
    (apiRoles.qna.markUpToDate as RoleType[]).concat(apiRoles.qna.delete),
  );

  /**
   * The form containing the qna's title and team.
   */
  editQuestionForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
  });

  /**
   * The form containing the qna's maintainer and up-to-date duration.
   */
  editAnswerForm = this.fb.group({
    maintainer: [null as null | OrgMemberUser, [Validators.required]],
    upToDateDuration: [{ num: null, frequency: null } as NumAndFreqInput],
  });

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

  /**
   * All of the input org member users as select options.
   */
  orgMemberOptions: SelectOption<OrgMemberUser | null>[] = [];

  /**
   * The question markdoc as a string, for internal tracking.
   */
  questionMarkdoc = '';

  /**
   * The answer markdoc as a string, for internal tracking.
   */
  answerMarkdoc = '';

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
  @Input() orgMember!: OrgMemberUser;

  /**
   * The user's role in the qna's team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * The organization the qna is in.
   */
  @Input() organization!: Organization;

  /**
   * All of the teams of the org the question can be asked to.
   */
  @Input()
  set teams(teams: Team[]) {
    this.teamOptions = [
      new SelectOption(null, 'Entire org'),
      ...teams.map((team) => new SelectOption(team, team.name)),
    ];
  }

  /**
   * All org members belonging to the org.
   */
  @Input()
  set orgMembers(orgMembers: OrgMemberUser[]) {
    this.orgMemberOptions = orgMembers.map((orgMember) => {
      const name = userDisplayName(orgMember.user);
      return new SelectOption(
        orgMember,
        `${name} (${orgMember.user.email})`,
        name,
      );
    });
  }

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
    this.questionMarkdoc = this.qna.qna.questionMarkdoc ?? '';
    this.editQuestionForm.setValue(
      { title: this.qna.qna.title, team: this.qna.team },
      { emitEvent: false },
    );

    this.answerMarkdoc = this.qna.qna.answerMarkdoc ?? '';
    this.editAnswerForm.setValue(
      {
        maintainer: this.qna.maintainer ?? this.orgMember,
        upToDateDuration: this.qnaNumAndFreq ?? {
          num: null,
          frequency: null,
        },
      },
      { emitEvent: false },
    );
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
      !isEqual(team, this.qna.team) ||
      title !== this.qna.qna.title ||
      this.questionMarkdoc !== (this.qna.qna.questionMarkdoc ?? '')
    );
  }

  /**
   * Whether the edit answer portion is distinct from the current qna.
   */
  get editAnswerDistinct(): boolean {
    const { maintainer } = this.editAnswerForm.value;
    return !!(
      this.answerMarkdoc !== this.qna.qna.answerMarkdoc ||
      !isEqual(maintainer, this.qna.maintainer) ||
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
    const { maintainer } = this.editAnswerForm.value;
    this.editAnswer.emit({
      answerMarkdoc: this.answerMarkdoc,
      maintainer: maintainer?.orgMember.slug ?? '',
      upToDateDuration:
        numAndFreqInputToDuration(
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
