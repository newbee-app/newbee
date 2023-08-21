import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { TeamRoleEnum, type Team } from '@newbee/shared/util';

/**
 * The dumb UI for displaying a team search result.
 */
@Component({
  selector: 'newbee-team-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-search-result.component.html',
})
export class TeamSearchResultComponent {
  /**
   * The team to display.
   */
  @Input() team!: Team;

  /**
   * The role a user has for the team, if displaying the result for a specific org member.
   */
  @Input() teamRole: TeamRoleEnum | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Navigate to the displayed team.
   */
  teamNavigate(): void {
    this.orgNavigate.emit(`/${ShortUrl.Team}/${this.team.slug}`);
  }
}
