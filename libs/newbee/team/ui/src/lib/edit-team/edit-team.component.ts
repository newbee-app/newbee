import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  SlugInputDirectiveModule,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  TeamRoleEnum,
  compareOrgRoles,
  type OrgMember,
  type Team,
  type TeamMember,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for editing an existing team.
 */
@Component({
  selector: 'newbee-edit-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    SlugInputDirectiveModule,
  ],
  templateUrl: './edit-team.component.html',
})
export class EditTeamComponent implements OnInit, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * Supported alert types.
   */
  readonly alertType = AlertType;

  /**
   * Information about the team.
   */
  @Input() team!: Team;

  /**
   * Information about the user's role in the org.
   */
  @Input() orgMember!: OrgMember;

  /**
   * Information about the user's role in the team.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * Whether the current value for the slug is taken.
   */
  @Input() slugTaken = false;

  /**
   * Whether to display the spinner on the edit button.
   */
  @Input() editPending = false;

  /**
   * Whether to display the spinner on the edit slug button.
   */
  @Input() editSlugPending = false;

  /**
   * Whether to display a spinner for the slug check.
   */
  @Input() checkPending = false;

  /**
   * Whether to display a spinner for the delete button.
   */
  @Input() deletePending = false;

  /**
   * HTTP client error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The current value of the team slug.
   */
  @Output() slug = new EventEmitter<string>();

  /**
   * The formatted value of the team slug, only emitted after the SlugInputDirective formats.
   */
  @Output() formattedSlug = new EventEmitter<string>();

  /**
   * The emitted edit team form, for use in the smart UI parent.
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * The emitted edit team slug form, for use in the smart UI parent.
   */
  @Output() editSlug = new EventEmitter<string>();

  /**
   * Emit to tell the smart UI parent to send a delete request.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal form to edit an existing team.
   */
  editTeamForm = this.fb.group({
    name: ['', Validators.required],
  });

  /**
   * The internal form to edit the team's slug.
   */
  editTeamSlugForm = this.fb.group({
    slug: ['', Validators.required],
  });

  /**
   * The internal form to delete a team.
   */
  deleteTeamForm = this.fb.group({
    slug: ['', Validators.required],
  });

  /**
   * Emit the team slug whenever the value changes.
   */
  constructor(private readonly fb: FormBuilder) {
    this.editTeamSlugForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (editTeamSlugForm) => {
          this.slug.emit(editTeamSlugForm.slug ?? '');
        },
      });
  }

  /**
   * Whether the edit team form has a value distinct from the current team's values.
   */
  get editDistinct(): boolean {
    const { name } = this.editTeamForm.value;
    return name !== this.team.name;
  }

  /**
   * Whether the edit team slug form has a value distinct from the current team's slug.
   */
  get editSlugDistinct(): boolean {
    const { slug } = this.editTeamSlugForm.value;
    return slug !== this.team.slug;
  }

  /**
   * Whether the delete team form's slug value matches the team's slug value.
   */
  get deleteSlugMatches(): boolean {
    const { slug } = this.deleteTeamForm.value;
    return slug === this.team.slug;
  }

  /**
   * Whether the org member is at least a moderator or the team member is an owner of the team.
   */
  get canAccessAdvanced(): boolean {
    if (compareOrgRoles(this.orgMember.role, OrgRoleEnum.Moderator) >= 0) {
      return true;
    }

    if (!this.teamMember) {
      return false;
    }

    return this.teamMember.role === TeamRoleEnum.Owner;
  }

  /**
   * Initialize the edit team form with the values of the current team.
   */
  ngOnInit(): void {
    this.editTeamForm.setValue({ name: this.team.name }, { emitEvent: false });
    this.editTeamSlugForm.setValue(
      { slug: this.team.slug },
      { emitEvent: false },
    );
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Emit the `edit` output.
   */
  emitEdit(): void {
    this.edit.emit(this.editTeamForm.value.name ?? '');
  }

  /**
   * Emit the `editSlug` output.
   */
  emitEditSlug(): void {
    this.editSlug.emit(this.editTeamSlugForm.value.slug ?? '');
  }

  /**
   * Emit the `delete` output.
   */
  emitDelete(): void {
    this.delete.emit();
  }

  /**
   * Get the error message associated with the key.
   *
   * @param key The key to find the error message.
   *
   * @returns The error message associated with the key, an empty string if there isn't one.
   */
  httpClientErrorMsg(...key: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, key.join('-'));
  }

  /**
   * Whether to display a form input as having an error.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputName: 'name' | 'slug' | 'delete'): boolean {
    return inputDisplayError(this.getFormControl(inputName));
  }

  /**
   * The input error message for the given form input.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputName: 'name' | 'slug' | 'delete'): string {
    return inputErrorMessage(this.getFormControl(inputName));
  }

  /**
   * Get the form control associated with the given name.
   *
   * @param inputName The name of the form control to get.
   *
   * @returns The form control associated with the given name.
   */
  private getFormControl(inputName: 'name' | 'slug' | 'delete'): FormControl {
    switch (inputName) {
      case 'name':
        return this.editTeamForm.controls.name;
      case 'slug':
        return this.editTeamSlugForm.controls.slug;
      case 'delete':
        return this.deleteTeamForm.controls.slug;
    }
  }
}
