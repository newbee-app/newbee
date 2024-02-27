import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  TeamRoleEnum,
  testOrgMember1,
  testOrgMemberSearchResult1,
} from '@newbee/shared/util';
import { MemberSearchResultComponent } from './member-search-result.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('MemberSearchResultComponent', () => {
  let component: MemberSearchResultComponent;
  let fixture: ComponentFixture<MemberSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSearchResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSearchResultComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMemberSearchResult1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('permissionsLine', () => {
    it(`should output the org member's permissions`, () => {
      expect(component.permissionsLine).toEqual(
        testOrgMemberSearchResult1.orgMember.role,
      );

      component.teamRole = TeamRoleEnum.Owner;
      expect(component.permissionsLine).toEqual(
        `${testOrgMemberSearchResult1.orgMember.role} | ${TeamRoleEnum.Owner}`,
      );
    });
  });

  describe('orgMemberNavigate', () => {
    it('should navigate to the given org member', () => {
      component.orgMemberNavigate();
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(1);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Member}/${testOrgMember1.slug}`,
      });
    });
  });
});
