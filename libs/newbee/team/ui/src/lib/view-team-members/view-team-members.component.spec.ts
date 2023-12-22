import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption, ShortUrl } from '@newbee/newbee/shared/util';
import {
  TeamRoleEnum,
  ascTeamRoleEnum,
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
  testTeamMemberRelation1,
  testTeamMemberRelation2,
} from '@newbee/shared/util';
import { ViewTeamMembersComponent } from './view-team-members.component';

describe('ViewTeamMembers', () => {
  let component: ViewTeamMembersComponent;
  let fixture: ComponentFixture<ViewTeamMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTeamMembersComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMember1;
    component.teamMembers = [testTeamMemberRelation1, testTeamMemberRelation2];
    component.orgMembers = [testOrgMemberUser1, testOrgMemberUser2];

    jest.spyOn(component.addTeamMember, 'emit');
    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should generate team roles', () => {
      expect(component.roleOptions).toEqual(
        ascTeamRoleEnum.map((role) => new SelectOption(role, role)),
      );
      expect(component.teamMembersToShow).toEqual([
        testTeamMemberRelation1,
        testTeamMemberRelation2,
      ]);
    });
  });

  describe('emitAddTeamMember', () => {
    it('should emit addTeamMember', () => {
      component.emitAddTeamMember();
      expect(component.addTeamMember.emit).not.toHaveBeenCalled();

      component.addMemberForm.setValue({
        member: testOrgMemberUser1,
        role: TeamRoleEnum.Member,
      });
      component.emitAddTeamMember();
      expect(component.addTeamMember.emit).toHaveBeenCalledTimes(1);
      expect(component.addTeamMember.emit).toHaveBeenCalledWith({
        orgMemberSlug: testOrgMember1.slug,
        role: TeamRoleEnum.Member,
      });
    });
  });

  describe('emitOrgNavigate', () => {
    it('should emit orgNavigate', () => {
      component.emitOrgNavigate(ShortUrl.Member, testOrgMember1.slug);
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(1);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith(
        `/${ShortUrl.Member}/${testOrgMember1.slug}`,
      );
    });
  });
});
