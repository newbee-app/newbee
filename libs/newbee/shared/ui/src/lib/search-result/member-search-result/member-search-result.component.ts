import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { TeamRoleEnum, type OrgMemberUser } from '@newbee/shared/util';

/**
 * The dumb UI for displaying an org member as a search result.
 */
@Component({
  selector: 'newbee-member-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-search-result.component.html',
})
export class MemberSearchResultComponent {
  /**
   * Information about the org member to display.
   */
  @Input() orgMember!: OrgMemberUser;

  /**
   * An optional team role to display, if displaying the org member as a member of a team.
   */
  @Input() teamRole: TeamRoleEnum | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Navigate to the displayed org member.
   */
  orgMemberNavigate(): void {
    this.orgNavigate.emit(
      `/${ShortUrl.Member}/${this.orgMember.orgMember.slug}`
    );
  }
}
