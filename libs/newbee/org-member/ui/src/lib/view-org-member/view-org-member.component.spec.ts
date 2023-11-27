import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { ViewOrgMemberComponent } from './view-org-member.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('ViewOrgMemberComponent', () => {
  let component: ViewOrgMemberComponent;
  let fixture: ComponentFixture<ViewOrgMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrgMemberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOrgMemberComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMemberRelation1;

    jest.spyOn(component.orgNavigate, 'emit');
    jest.spyOn(component.memberNavigate, 'emit');
    jest.spyOn(component.editRole, 'emit');
    jest.spyOn(component.delete, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('getters', () => {
    describe('totals', () => {
      it('should output correctly based on totals', () => {
        expect(component.totalTeams).toEqual('1 team');
        expect(component.totalCreatedQnas).toEqual('1 QnA');
        expect(component.totalMaintainedQnas).toEqual('1 QnA');
        expect(component.totalCreatedDocs).toEqual('1 doc');
        expect(component.totalMaintainedDocs).toEqual('1 doc');

        component.orgMember.createdQnas.total = 100;
        component.orgMember.maintainedQnas.total = 100;
        component.orgMember.createdDocs.total = 100;
        component.orgMember.maintainedDocs.total = 100;
        expect(component.totalCreatedQnas).toEqual('100 QnAs');
        expect(component.totalMaintainedQnas).toEqual('100 QnAs');
        expect(component.totalCreatedDocs).toEqual('100 docs');
        expect(component.totalMaintainedDocs).toEqual('100 docs');
      });
    });

    describe('roles', () => {
      it('should vary based on org member and user org member roles', () => {
        expect(component.canEdit).toBeFalsy();
        expect(component.orgRoleEnumOptions).toEqual([]);

        component.userOrgMember = testOrgMember1;
        expect(component.canEdit).toBeTruthy();
        expect(component.orgRoleEnumOptions).toEqual(
          Object.values(OrgRoleEnum).map(
            (role) => new SelectOption(role, role),
          ),
        );

        component.userOrgMember = {
          ...testOrgMember1,
          role: OrgRoleEnum.Moderator,
        };
        expect(component.canEdit).toBeFalsy();
        expect(component.orgRoleEnumOptions).toEqual(
          [OrgRoleEnum.Member, OrgRoleEnum.Moderator].map(
            (role) => new SelectOption(role, role),
          ),
        );

        component.userOrgMember = {
          ...testOrgMember1,
          role: OrgRoleEnum.Member,
        };
        expect(component.canEdit).toBeFalsy();
        expect(component.orgRoleEnumOptions).toEqual(
          [OrgRoleEnum.Member].map((role) => new SelectOption(role, role)),
        );

        component.orgMember = {
          ...testOrgMemberRelation1,
          orgMember: {
            ...testOrgMember1,
            role: OrgRoleEnum.Member,
          },
        };
        expect(component.canEdit).toBeFalsy();

        component.userOrgMember = {
          ...testOrgMember1,
          role: OrgRoleEnum.Moderator,
        };
        expect(component.canEdit).toBeTruthy();

        component.orgMember = {
          ...testOrgMemberRelation1,
          orgMember: {
            ...testOrgMember1,
            role: OrgRoleEnum.Moderator,
          },
        };
        expect(component.canEdit).toBeTruthy();

        component.orgMember = {
          ...testOrgMemberRelation1,
          orgMember: {
            ...testOrgMember1,
            role: OrgRoleEnum.Owner,
          },
        };
        expect(component.canEdit).toBeFalsy();
      });
    });
  });

  describe('init', () => {
    it('should set changeRoleSelect', () => {
      expect(component.changeRoleSelect.value).toEqual(
        component.orgMember.orgMember.role,
      );
    });
  });

  describe('editOrgMemberRole', () => {
    it('should emit editRole if the select is unique', () => {
      component.editOrgMemberRole();
      expect(component.editRole.emit).not.toBeCalled();

      component.changeRoleSelect.setValue(OrgRoleEnum.Moderator);
      component.editOrgMemberRole();
      expect(component.editRole.emit).toBeCalledTimes(1);
      expect(component.editRole.emit).toBeCalledWith(OrgRoleEnum.Moderator);

      component.changeRoleSelect.setValue(OrgRoleEnum.Member);
      component.editOrgMemberRole();
      expect(component.editRole.emit).toBeCalledTimes(2);
      expect(component.editRole.emit).toBeCalledWith(OrgRoleEnum.Member);
    });
  });
});
