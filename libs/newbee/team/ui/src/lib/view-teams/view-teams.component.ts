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
import {
  RouteAndQueryParams,
  SearchResultFormat,
  ShortUrl,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  Team,
  TeamMemberAndTeam,
  TeamRoleEnum,
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
  private _teams: Team[] = [];

  /**
   * All of the teams the org member is in and their roles in them.
   */
  @Input()
  set orgMemberTeams(orgMemberTeams: TeamMemberAndTeam[]) {
    this._teamSlugToRole.clear();
    orgMemberTeams.forEach((tm) => {
      this._teamSlugToRole.set(tm.team.slug, tm.teamMember.role);
    });
  }

  /**
   * The org member looking at the screen.
   */
  @Input() orgMember!: OrgMember;

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

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
  private _teamsToShow: Team[] = [];

  /**
   * A map mapping team slugs to the org member's role in the team.
   */
  get teamSlugToRole(): Map<string, TeamRoleEnum> {
    return this._teamSlugToRole;
  }
  _teamSlugToRole = new Map<string, TeamRoleEnum>();

  /**
   * Update the teams to show when the searchbar changes.
   */
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
