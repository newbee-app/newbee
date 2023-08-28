import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhoneNumberPipeModule, ShortUrl } from '@newbee/newbee/shared/util';
import {
  TeamRoleEnum,
  userDisplayName,
  type OrgMemberQueryResult,
} from '@newbee/shared/util';
import { SearchResultHeaderComponent } from '../header';

/**
 * The dumb UI for displaying an org member as a search result.
 */
@Component({
  selector: 'newbee-member-search-result',
  standalone: true,
  imports: [CommonModule, PhoneNumberPipeModule, SearchResultHeaderComponent],
  templateUrl: './member-search-result.component.html',
})
export class MemberSearchResultComponent {
  /**
   * Helper function to get user's display name.
   */
  readonly userDisplayName = userDisplayName;

  /**
   * The format in which the search result should be shown.
   */
  @Input() format: 'card' | 'list' = 'card';

  /**
   * Information about the org member to display.
   */
  @Input() orgMember!: OrgMemberQueryResult;

  /**
   * An optional team role to display, if displaying the org member as a member of a team.
   */
  @Input() teamRole: TeamRoleEnum | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Get the line displaying the permissions the org member has.
   */
  get permissionsLine(): string {
    return (
      this.orgMember.orgMember.role +
      (this.teamRole ? ` | ${this.teamRole}` : '')
    );
  }

  /**
   * Navigate to the displayed org member.
   */
  orgMemberNavigate(): void {
    this.orgNavigate.emit(
      `/${ShortUrl.Member}/${this.orgMember.orgMember.slug}`
    );
  }
}
