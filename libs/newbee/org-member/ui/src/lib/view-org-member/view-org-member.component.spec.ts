import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  OrgRoleEnum,
  ascOrgRoleEnum,
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
    component.userOrgMember = testOrgMember1;

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
  });

  describe('init', () => {
    it('should create orgRoleEnumOptions and set changeRoleSelect', () => {
      expect(component.orgRoleEnumOptions).toEqual(
        ascOrgRoleEnum.map((role) => new SelectOption(role, role)),
      );
      expect(component.changeRoleSelect.value).toEqual(
        component.orgMember.orgMember.role,
      );
    });
  });

  describe('editOrgMemberRole', () => {
    it('should emit editRole if the select is unique', () => {
      component.editOrgMemberRole();
      expect(component.editRole.emit).not.toHaveBeenCalled();

      component.changeRoleSelect.setValue(OrgRoleEnum.Moderator);
      component.editOrgMemberRole();
      expect(component.editRole.emit).toHaveBeenCalledTimes(1);
      expect(component.editRole.emit).toHaveBeenCalledWith(
        OrgRoleEnum.Moderator,
      );

      component.changeRoleSelect.setValue(OrgRoleEnum.Member);
      component.editOrgMemberRole();
      expect(component.editRole.emit).toHaveBeenCalledTimes(2);
      expect(component.editRole.emit).toHaveBeenCalledWith(OrgRoleEnum.Member);
    });
  });
});
