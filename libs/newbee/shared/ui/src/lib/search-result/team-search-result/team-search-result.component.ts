import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RouteAndQueryParams,
  SearchResultFormat,
  ShortUrl,
} from '@newbee/newbee/shared/util';
import { TeamRoleEnum, type TeamQueryResult } from '@newbee/shared/util';
import { SearchResultTypeBtnComponent } from '../../btn';
import { SearchResultHeaderComponent } from '../header';

/**
 * The dumb UI for displaying a team search result.
 */
@Component({
  selector: 'newbee-team-search-result',
  standalone: true,
  imports: [
    CommonModule,
    SearchResultHeaderComponent,
    SearchResultTypeBtnComponent,
  ],
  templateUrl: './team-search-result.component.html',
})
export class TeamSearchResultComponent {
  /**
   * The format in which the search result should be shown.
   */
  @Input() format = SearchResultFormat.List;

  /**
   * The team to display.
   */
  @Input() team!: TeamQueryResult;

  /**
   * The role a user has for the team, if displaying the result for a specific org member.
   */
  @Input() teamRole: TeamRoleEnum | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Navigate to the displayed team.
   */
  teamNavigate(): void {
    this.orgNavigate.emit({ route: `${ShortUrl.Team}/${this.team.slug}` });
  }
}
