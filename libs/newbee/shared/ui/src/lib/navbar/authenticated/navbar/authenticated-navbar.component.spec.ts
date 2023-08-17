import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  OrgRoleEnum,
  testOrganization1,
  testOrganization2,
  testOrgMember1,
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
    jest.spyOn(component.search, 'emit');
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

  describe('ngOnInit', () => {
    it(`should set the searchbar's value`, () => {
      component.initialSearchTerm = 'searching';
      component.ngOnInit();
      expect(component.searchTerm.value).toEqual({ searchbar: 'searching' });
    });
  });

  describe('selectSuggestion', () => {
    it('should set the search term and emit search', () => {
      component.selectSuggestion('suggestion');
      expect(component.searchTerm.value).toEqual({ searchbar: 'suggestion' });
      expect(component.search.emit).toBeCalledTimes(1);
      expect(component.search.emit).toBeCalledWith('suggestion');
    });
  });

  describe('emitSearch', () => {
    it(`should emit the search term if it's not empty`, () => {
      component.emitSearch();
      expect(component.search.emit).not.toBeCalled();

      component.searchTerm.setValue({ searchbar: 'searching' });
      component.emitSearch();
      expect(component.search.emit).toBeCalledTimes(1);
      expect(component.search.emit).toBeCalledWith('searching');
    });
  });

  describe('selectOrganization', () => {
    it('should change the selected organization and emit', () => {
      component.selectOrganization(testOrganization2);
      expect(component.selectedOrganization).toEqual(testOrganization2);
      expect(component.selectedOrganizationChange.emit).toBeCalledTimes(1);
      expect(component.selectedOrganizationChange.emit).toBeCalledWith(
        testOrganization2
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
