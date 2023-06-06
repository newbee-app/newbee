import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  OrgRoleEnum,
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
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
      if (!component.orgMember) {
        return;
      }

      component.orgMember.orgMember.role = OrgRoleEnum.Moderator;
      expect(component.isAdmin).toBeTruthy();

      component.orgMember.orgMember.role = OrgRoleEnum.Member;
      expect(component.isAdmin).toBeFalsy();

      component.orgMember.orgMember.role = OrgRoleEnum.Owner;
      component.selectedOrganization = testOrganization2;
      expect(component.isAdmin).toBeFalsy();
    });
  });

  describe('selectOrganization', () => {
    it('should change the selected organization and emit outputs', () => {
      component.selectOrganization(testOrganization2);
      expect(component.selectedOrganization).toEqual(testOrganization2);
      expect(component.selectedOrganizationChange.emit).toBeCalledTimes(1);
      expect(component.selectedOrganizationChange.emit).toBeCalledWith(
        testOrganization2
      );
      expect(component.navigateToLink.emit).toBeCalledTimes(1);
      expect(component.navigateToLink.emit).toBeCalledWith(
        `/${testOrganization2.slug}`
      );
    });
  });

  describe('emitNavigateToLink', () => {
    it('should emit a request to navigate to the link associated with the route keyword', () => {
      component.emitNavigateToLink('');
      expect(component.navigateToLink.emit).toBeCalledTimes(1);
      expect(component.navigateToLink.emit).toBeCalledWith('/');
    });
  });

  describe('emitLogout', () => {
    it('should emit logout output', () => {
      component.emitLogout();
      expect(component.logout.emit).toBeCalledTimes(1);
      expect(component.logout.emit).toBeCalledWith();
    });
  });
});
