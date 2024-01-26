import { CreatorOrMaintainer } from '@newbee/shared/util';
import { OrgMemberPostTab } from '../../enum';

/**
 * Convert an OrgMemberPostTab to a string.
 *
 * @param tab The value to convert.
 *
 * @returns The tab value as a string, `null` if the value is `All`.
 */
export function orgMemberPostTabToStr(
  tab: OrgMemberPostTab,
): CreatorOrMaintainer | null {
  switch (tab) {
    case OrgMemberPostTab.All:
      return null;
    case OrgMemberPostTab.Created:
      return 'creator';
    case OrgMemberPostTab.Maintained:
      return 'maintainer';
  }
}

/**
 * Convert a string to an OrgMemberPostTab.
 *
 * @param creatorOrMaintainer The string to convert.
 *
 * @returns The string as a tab.
 */
export function strToOrgMemberPostTab(
  creatorOrMaintainer: CreatorOrMaintainer | null,
): OrgMemberPostTab {
  switch (creatorOrMaintainer) {
    case 'creator':
      return OrgMemberPostTab.Created;
    case 'maintainer':
      return OrgMemberPostTab.Maintained;
    case null:
      return OrgMemberPostTab.All;
  }
}
