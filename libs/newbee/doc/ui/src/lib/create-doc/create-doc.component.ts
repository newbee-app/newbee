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
  DigitOnlyDirectiveModule,
  Frequency,
  HttpClientError,
  SelectOption,
  defaultUpToDateDuration,
  formNumAndFreqToDuration,
  frequencySelectOptions,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  BaseCreateDocDto,
  Keyword,
  Team,
  TeamMemberAndTeam,
  type Organization,
} from '@newbee/shared/util';

/**
 * The dumb UI for creating a doc.
 */
@Component({
  selector: 'newbee-create-doc',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    AlertComponent,
    MarkdocEditorComponent,
    DigitOnlyDirectiveModule,
  ],
  templateUrl: './create-doc.component.html',
})
export class CreateDocComponent implements OnInit {
  readonly alertType = AlertType;
  readonly keyword = Keyword;

  /**
   * An HTTP error, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * Whether to display the spinner on the create button.
   */
  @Input() createPending = false;

  /**
   * The org we're creating the doc in.
   */
  @Input() organization!: Organization;

  /**
   * All of the teams of the org the doc can be put in, mixed in with the user's role in the teams to ensure they have the adequate permissions to create docs in those teams.
   */
  @Input() teams: TeamMemberAndTeam[] = [];

  /**
   * The query param representing a team slug, if one is specified.
   */
  @Input() teamSlugParam: string | null = null;

  /**
   * Tells the smart UI parent when the doc is ready to be created.
   */
  @Output() create = new EventEmitter<BaseCreateDocDto>();

  /**
   * The doc markdoc as a string, for internal tracking.
   */
  docMarkdoc = '';

  /**
   * All of the input teams as select options.
   */
  teamOptions: SelectOption<Team | null>[] = [];

  /**
   * The form containing the doc's title and team.
   */
  docForm = this.fb.group({
    title: ['', [Validators.required]],
    team: [null as null | Team],
    upToDateDuration: this.fb.group({
      num: [null as number | null, [Validators.min(1)]],
      frequency: [null as Frequency | null],
    }),
  });

  readonly frequencyOptions = frequencySelectOptions(
    this.docForm.controls.upToDateDuration.controls.num,
  );

  constructor(private readonly fb: FormBuilder) {}

  /**
   * What to display for the up-to-date duration tagline.
   */
  get defaultUpToDateDuration(): string {
    const { team } = this.docForm.value;
    return defaultUpToDateDuration(this.organization, team);
  }

  /**
   * Initialize the team options and the team values with a value from the team slug param, if specified.
   */
  ngOnInit(): void {
    this.teamOptions = [
      new SelectOption(null, 'Entire org'),
      ...this.teams.map((team) => new SelectOption(team.team, team.team.name)),
    ];

    if (!this.teamSlugParam) {
      return;
    }

    const team = this.teams.find(
      (team) => team.team.slug === this.teamSlugParam,
    );
    if (!team) {
      return;
    }

    this.docForm.controls.team.setValue(team.team);
  }

  /**
   * Called to emit the create output based off of the UI's values.
   */
  emitCreate(): void {
    const { title, team } = this.docForm.value;
    this.create.emit({
      title: title ?? '',
      team: team?.slug ?? null,
      docMarkdoc: this.docMarkdoc,
      upToDateDuration:
        formNumAndFreqToDuration(
          this.docForm.controls.upToDateDuration.value,
        )?.toISOString() ?? null,
    });
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
   * @param inputName
   * @returns
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
