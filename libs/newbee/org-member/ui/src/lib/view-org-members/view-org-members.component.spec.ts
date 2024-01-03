import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  OrgRoleEnum,
  generateLteOrgRoles,
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
  testUser1,
} from '@newbee/shared/util';
import { ViewOrgMembersComponent } from './view-org-members.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('ViewOrgMembersComponent', () => {
  let component: ViewOrgMembersComponent;
  let fixture: ComponentFixture<ViewOrgMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrgMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOrgMembersComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMember1;
    component.orgMembers = [testOrgMemberUser1, testOrgMemberUser2];

    jest.spyOn(component.invite, 'emit');
    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should generate role options', () => {
      expect(component.roleOptions).toEqual(
        generateLteOrgRoles(testOrgMember1.role).map(
          (role) => new SelectOption(role, role),
        ),
      );
    });

    it('should update org members to show', () => {
      expect(component.orgMembersToShow).toEqual([
        testOrgMemberUser1,
        testOrgMemberUser2,
      ]);
    });

    it('should reset the form after a user is invited', () => {
      component.inviteOrgMemberForm.setValue({
        email: testUser1.email,
        role: OrgRoleEnum.Member,
      });
      component.invitePending = true;
      expect(component.inviteOrgMemberForm.value).toEqual({
        email: '',
        role: null,
      });
      expect(component.inviteOrgMemberForm.pristine).toBeTruthy();
      expect(component.inviteOrgMemberForm.untouched).toBeTruthy();
    });
  });

  describe('emitInvite', () => {
    it('should emit invite', () => {
      component.emitInvite();
      expect(component.invite.emit).not.toHaveBeenCalled();

      component.inviteOrgMemberForm.setValue({
        email: testUser1.email,
        role: OrgRoleEnum.Member,
      });
      component.emitInvite();
      expect(component.invite.emit).toHaveBeenCalledTimes(1);
      expect(component.invite.emit).toHaveBeenCalledWith({
        email: testUser1.email,
        role: OrgRoleEnum.Member,
      });
    });
  });
});
