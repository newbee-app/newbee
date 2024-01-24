import { OrgMemberPostTab } from '../../enum';
import {
  orgMemberPostTabToStr,
  strToOrgMemberPostTab,
} from './org-member-post-tab.enum.function';

describe('OrgMemberPostTab functions', () => {
  describe('orgMemberPostTabToStr', () => {
    it('should convert to a string', () => {
      expect(orgMemberPostTabToStr(OrgMemberPostTab.All)).toBeNull();
      expect(orgMemberPostTabToStr(OrgMemberPostTab.Created)).toEqual(
        'creator',
      );
      expect(orgMemberPostTabToStr(OrgMemberPostTab.Maintained)).toEqual(
        'maintainer',
      );
    });
  });

  describe('strToOrgMemberPostTab', () => {
    it('should convert to an enum', () => {
      expect(strToOrgMemberPostTab('creator')).toEqual(
        OrgMemberPostTab.Created,
      );
      expect(strToOrgMemberPostTab('maintainer')).toEqual(
        OrgMemberPostTab.Maintained,
      );
      expect(strToOrgMemberPostTab(null)).toEqual(OrgMemberPostTab.All);
    });
  });
});
