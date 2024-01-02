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
    jest.spyOn(component.editTeamMember, 'emit');
    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should generate team roles', () => {
      expect(component.roleOptions).toEqual(
        ascTeamRoleEnum.map((role) => new SelectOption(role, role)),
      );
      expect(component.teamMembersToShow).toEqual([
        testTeamMemberRelation1,
        testTeamMemberRelation2,
      ]);
    });

    it('should generate team member controls', () => {
      expect(component.editTeamMemberForm.controls.roles.length).toEqual(
        component.teamMembers.length,
      );
      expect(component.orgMemberSlugToIndex.size).toEqual(
        component.teamMembers.length,
      );
    });

    it('should generate org members', () => {
      expect(component.orgMemberOptions.length).toEqual(2);
    });

    it('should reset form control if addMemberPending is switched to true', () => {
      component.addTeamMemberForm.setValue({
        member: testOrgMemberUser1,
        role: TeamRoleEnum.Member,
      });
      component.addTeamMemberForm.markAsTouched();
      component.addTeamMemberForm.markAsDirty();
      component.addTeamMemberPending = true;
      expect(component.addTeamMemberForm.value).toEqual({
        member: null,
        role: null,
      });
      expect(component.addTeamMemberForm.pristine).toBeTruthy();
      expect(component.addTeamMemberForm.untouched).toBeTruthy();
    });
  });

  describe('emitAddTeamMember', () => {
    it('should emit addTeamMember and remove from editingTeamMembers', () => {
      component.emitAddTeamMember();
      expect(component.addTeamMember.emit).not.toHaveBeenCalled();

      component.addTeamMemberForm.setValue({
        member: testOrgMemberUser1,
        role: TeamRoleEnum.Member,
      });
      component.editingTeamMembers.add(testOrgMemberUser1.orgMember.slug);
      component.emitAddTeamMember();
      expect(component.addTeamMember.emit).toHaveBeenCalledTimes(1);
      expect(component.addTeamMember.emit).toHaveBeenCalledWith({
        orgMemberSlug: testOrgMember1.slug,
        role: TeamRoleEnum.Member,
      });
      expect(
        component.editingTeamMembers.has(testOrgMemberUser1.orgMember.slug),
      ).toBeFalsy();
    });
  });

  describe('emitEditTeamMember', () => {
    it('should emit editTeamMember', () => {
      component.editTeamMemberForm.controls.roles
        .at(0)
        .setValue(TeamRoleEnum.Member);
      component.editingTeamMembers.add(testTeamMemberRelation1.orgMember.slug);
      component.emitEditTeamMember(testTeamMemberRelation1.orgMember.slug);
      expect(component.editTeamMember.emit).toHaveBeenCalledTimes(1);
      expect(component.editTeamMember.emit).toHaveBeenCalledWith({
        orgMemberSlug: testTeamMemberRelation1.orgMember.slug,
        updateTeamMemberDto: { role: TeamRoleEnum.Member },
      });
      expect(
        component.editingTeamMembers.has(
          testTeamMemberRelation1.orgMember.slug,
        ),
      ).toBeFalsy();
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

  describe('roleIsUnique', () => {
    it('should return true only if form role is unique', () => {
      expect(
        component.roleIsUnique(
          testTeamMemberRelation1.orgMember.slug,
          testTeamMemberRelation1.teamMember.role,
        ),
      ).toBeFalsy();

      component.editTeamMemberForm.controls.roles
        .at(0)
        .setValue(TeamRoleEnum.Member);
      expect(
        component.roleIsUnique(
          testTeamMemberRelation1.orgMember.slug,
          TeamRoleEnum.Owner,
        ),
      );
    });
  });
});
