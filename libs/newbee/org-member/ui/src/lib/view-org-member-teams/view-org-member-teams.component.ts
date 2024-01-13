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
import { SearchResultFormat } from '@newbee/newbee/shared/util';
import { TeamMemberAndTeam } from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for viewing all of the teams an org member belongs to.
 */
@Component({
  selector: 'newbee-view-org-member-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchbarComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-org-member-teams.component.html',
})
export class ViewOrgMemberTeamsComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchResultFormat = SearchResultFormat;

  /**
   * All of the teams an org member belongs to.
   */
  @Input()
  get teams(): TeamMemberAndTeam[] {
    return this._teams;
  }
  set teams(teams: TeamMemberAndTeam[]) {
    this._teams = teams;
    this.updateTeamsToShow();
  }
  private _teams: TeamMemberAndTeam[] = [];

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * The form control for the serachbar.
   */
  searchbar = this.fb.control('');

  /**
   * The teams to show.
   */
  get teamsToShow(): TeamMemberAndTeam[] {
    return this._teamsToShow;
  }
  private _teamsToShow: TeamMemberAndTeam[] = [];

  /**
   * Update the teams to show using the current searchbar value.
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

    this._teamsToShow = this._teams.filter((tm) =>
      tm.team.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
}
