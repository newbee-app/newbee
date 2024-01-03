import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SearchResultComponent,
  SearchbarComponent,
} from '@newbee/newbee/shared/ui';
import { SearchResultFormat, ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  Team,
  apiRoles,
  checkRoles,
  type OrgMember,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for viewing all of the teams in an org.
 */
@Component({
  selector: 'newbee-view-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchbarComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-teams.component.html',
})
export class ViewTeamsComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchResultFormat = SearchResultFormat;
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;

  /**
   * All of the teams in an org.
   */
  @Input()
  get teams(): Team[] {
    return this._teams;
  }
  set teams(teams: Team[]) {
    this._teams = teams;
    this.updateTeamsToShow();
  }
  _teams: Team[] = [];

  /**
   * The org member looking at the screen.
   */
  @Input() orgMember!: OrgMember;

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * The form control for the searchbar.
   */
  searchbar = this.fb.control('');

  /**
   * The teams to show.
   */
  get teamsToShow(): Team[] {
    return this._teamsToShow;
  }
  _teamsToShow: Team[] = [];

  constructor(private readonly fb: FormBuilder) {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.updateTeamsToShow();
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Emit `orgNavigate` with the given paths.
   * @param paths The path to navigate to, joined by `/`.
   */
  emitOrgNavigate(...paths: string[]): void {
    this.orgNavigate.emit(`/${paths.join('/')}`);
  }

  /**
   * Update `teamsToShow` to filter using the given search term.
   */
  private updateTeamsToShow(): void {
    const searchTerm = this.searchbar.value;
    if (!searchTerm) {
      this._teamsToShow = this._teams;
      return;
    }

    this._teamsToShow = this._teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
}
