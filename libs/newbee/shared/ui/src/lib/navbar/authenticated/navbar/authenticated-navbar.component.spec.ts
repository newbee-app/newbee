import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganization2,
  testUser1,
} from '@newbee/shared/util';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('AuthenticatedNavbarComponent', () => {
  let component: AuthenticatedNavbarComponent;
  let fixture: ComponentFixture<AuthenticatedNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedNavbarComponent);
    component = fixture.componentInstance;

    component.user = testUser1;
    component.organizations = [testOrganization1, testOrganization2];
    component.selectedOrganization = testOrganization1;
    component.orgMember = testOrgMemberRelation1;

    jest.spyOn(component.selectedOrganizationChange, 'emit');
    jest.spyOn(component.navigateToLink, 'emit');
    jest.spyOn(component.logout, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('isAdmin', () => {
    it('should be true if org member is moderator or higher', () => {
      expect(component.isAdmin).toBeTruthy();

      component.orgMember = {
        ...testOrgMemberRelation1,
        orgMember: { ...testOrgMember1, role: OrgRoleEnum.Moderator },
      };
      expect(component.isAdmin).toBeTruthy();

      component.orgMember = {
        ...testOrgMemberRelation1,
        orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
      };
      expect(component.isAdmin).toBeFalsy();
    });
  });

  describe('selectOrganization', () => {
    it('should change the selected organization and emit', () => {
      component.selectOrganization(testOrganization2);
      expect(component.selectedOrganization).toEqual(testOrganization2);
      expect(component.selectedOrganizationChange.emit).toHaveBeenCalledTimes(
        1,
      );
      expect(component.selectedOrganizationChange.emit).toHaveBeenCalledWith(
        testOrganization2,
      );
    });
  });

  describe('emitNavigateToLink', () => {
    it('should emit a request to navigate to the link associated with the route keyword', () => {
      component.emitNavigateToLink('');
      expect(component.navigateToLink.emit).toHaveBeenCalledTimes(1);
      expect(component.navigateToLink.emit).toHaveBeenCalledWith('/');
    });
  });

  describe('emitLogout', () => {
    it('should emit logout output', () => {
      component.emitLogout();
      expect(component.logout.emit).toHaveBeenCalledTimes(1);
      expect(component.logout.emit).toHaveBeenCalledWith();
    });
  });
});
