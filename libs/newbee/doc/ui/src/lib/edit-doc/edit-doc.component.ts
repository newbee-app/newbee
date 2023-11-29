import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  userHasDeletePermissions,
  userHasEditPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/doc/util';
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
  BaseUpdateDocDto,
  Keyword,
  Team,
  TeamMember,
  type DocNoOrg,
  type OrgMember,
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
    AlertComponent,
    MarkdocEditorComponent,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './edit-doc.component.html',
})
export class EditDocComponent implements OnInit {
  readonly alertType = AlertType;
  readonly keyword = Keyword;

  /**
   * The form containing the doc's title, team, and up-to-date duration.
   */
  editDocForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
    upToDateDuration: this.fb.group({
      num: [null as null | number, [Validators.min(0)]],
      frequency: [null as null | Frequency],
    }),
  });

  readonly frequencyOptions = frequencySelectOptions(
    this.editDocForm.controls.upToDateDuration.controls.num,
  );

  /**
   * The doc markdoc as a string, for internal tracking.
   */
  docMarkdoc = '';

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

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
  @Input() orgMember!: OrgMember;

  /**
   * The user's role in the doc's team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * All of the teams of the org the doc can be moved to.
   */
  @Input() teams: Team[] = [];

  /**
   * The organization the doc is in.
   */
  @Input() organization!: Organization;

  /**
   * Whether the edit doc action is pending.
   */
  @Input() editDocPending = false;

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
   * Initialize the values of docMarkdoc and teamOptions with the input doc.
   */
  ngOnInit(): void {
    this.docMarkdoc = this.doc.doc.docMarkdoc;
    this.teamOptions = [
      new SelectOption(null, 'Entire org'),
      ...this.teams.map((team) => new SelectOption(team, team.name)),
    ];
    this.editDocForm.setValue({
      title: this.doc.doc.title,
      team: this.doc.team,
      upToDateDuration: this.docNumAndFreq ?? { num: null, frequency: null },
    });
  }

  /**
   * Whether the user has edit permissions.
   */
  get hasEditPermissions(): boolean {
    return userHasEditPermissions(this.doc, this.orgMember, this.teamMember);
  }

  /**
   * Whether the user has up-to-date permissions.
   */
  get hasUpToDatePermissions(): boolean {
    return userHasUpToDatePermissions(
      this.doc,
      this.orgMember,
      this.teamMember,
    );
  }

  /**
   * Whether the user has delete permissions.
   */
  get hasDeletePermissions(): boolean {
    return userHasDeletePermissions(this.doc, this.orgMember, this.teamMember);
  }

  /**
   * Whether the edit portion is distinct from the current doc.
   */
  get editDistinct(): boolean {
    const { team, title } = this.editDocForm.value;
    return (
      !isEqual(team, this.doc.team) ||
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
    const { title, team } = this.editDocForm.value;
    this.edit.emit({
      title: title ?? '',
      team: team?.slug ?? null,
      upToDateDuration:
        formNumAndFreqToDuration(
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
