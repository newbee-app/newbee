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
  BaseUpdateDocDto,
  Keyword,
  Team,
  TeamMember,
  apiRoles,
  checkRoles,
  userDisplayName,
  type DocNoOrg,
  type OrgMemberUser,
  type Organization,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';

/**
 * A dumb UI for editing a doc.
 */
@Component({
  selector: 'newbee-edit-doc',
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
  templateUrl: './edit-doc.component.html',
})
export class EditDocComponent implements OnInit {
  readonly alertType = AlertType;
  readonly keyword = Keyword;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;

  /**
   * The form containing the doc's title, team, and up-to-date duration.
   */
  editDocForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
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
   * The doc markdoc as a string, for internal tracking.
   */
  docMarkdoc = '';

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The doc to edit.
   */
  @Input() doc!: DocNoOrg;

  /**
   * The user's role in the doc's org.
   */
  @Input() orgMember!: OrgMemberUser;

  /**
   * The user's role in the doc's team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * The organization the doc is in.
   */
  @Input() organization!: Organization;

  /**
   * All of the teams of the org the doc can be moved to.
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
   * Whether the edit action is pending.
   */
  @Input() editPending = false;

  /**
   * Whether the up-to-date action is pending.
   */
  @Input() upToDatePending = false;

  /**
   * Whether the delete action is pending.
   */
  @Input() deletePending = false;

  /**
   * Tells the smart UI parent to edit the doc with the given values.
   */
  @Output() edit = new EventEmitter<BaseUpdateDocDto>();

  /**
   * Tells the smart UI parent to mark the doc as up-to-date.
   */
  @Output() markAsUpToDate = new EventEmitter<void>();

  /**
   * Tells the smart UI parent to delete the doc.
   */
  @Output() delete = new EventEmitter<void>();

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Initialize the values of docMarkdoc and the editDocForm with the input doc.
   */
  ngOnInit(): void {
    this.docMarkdoc = this.doc.doc.docMarkdoc;
    this.editDocForm.setValue(
      {
        title: this.doc.doc.title,
        team: this.doc.team,
        maintainer: this.doc.maintainer ?? this.orgMember,
        upToDateDuration: this.docNumAndFreq ?? { num: null, frequency: null },
      },
      { emitEvent: false },
    );
  }

  /**
   * Whether the edit portion is distinct from the current doc.
   */
  get editDistinct(): boolean {
    const { team, title, maintainer } = this.editDocForm.value;
    return (
      !isEqual(team, this.doc.team) ||
      !isEqual(maintainer, this.doc.maintainer) ||
      title !== this.doc.doc.title ||
      this.docMarkdoc !== this.doc.doc.docMarkdoc ||
      numAndFreqIsDistinct(
        this.docNumAndFreq,
        this.editDocForm.controls.upToDateDuration.value,
      )
    );
  }

  /**
   * What to display for the up-to-date duration tagline.
   */
  get defaultUpToDateDuration(): string {
    return defaultUpToDateDuration(this.organization, this.doc.team);
  }

  /**
   * The doc's up-to-date duration, as a num and frequency.
   */
  private get docNumAndFreq(): NumAndFreq | null {
    return this.doc.doc.upToDateDuration
      ? durationToNumAndFreq(dayjs.duration(this.doc.doc.upToDateDuration))
      : null;
  }

  /**
   * Emit a request to edit the doc.
   */
  emitEdit(): void {
    const { title, team, maintainer } = this.editDocForm.value;
    this.edit.emit({
      title: title ?? '',
      team: team?.slug ?? null,
      maintainer: maintainer?.orgMember.slug ?? '',
      upToDateDuration:
        numAndFreqInputToDuration(
          this.editDocForm.controls.upToDateDuration.value,
        )?.toISOString() ?? null,
      docMarkdoc: this.docMarkdoc,
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
