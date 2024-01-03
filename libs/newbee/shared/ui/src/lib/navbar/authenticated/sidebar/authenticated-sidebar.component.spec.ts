import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganization1,
  testOrganization2,
} from '@newbee/shared/util';
import { AuthenticatedSidebarComponent } from './authenticated-sidebar.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('AuthenticatedSidebarComponent', () => {
  let component: AuthenticatedSidebarComponent;
  let fixture: ComponentFixture<AuthenticatedSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedSidebarComponent);
    component = fixture.componentInstance;

    component.organizations = [testOrganization1, testOrganization2];
    component.selectedOrganization = testOrganization1;

    jest.spyOn(component.selectedOrganizationChange, 'emit');
    jest.spyOn(component.navigateToLink, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('shortenOrgName', () => {
    it('should shorten names respecting capitals', () => {
      const shorten = component.shortenOrgName;
      expect(shorten('NewBee')).toEqual('N');
      expect(shorten('Hello World')).toEqual('HW');
      expect(shorten('My cool Org')).toEqual('McO');
      expect(shorten('Some really really really really long org name')).toEqual(
        'Srrr',
      );
    });
  });

  describe('selectOrganization', () => {
    it('should change the selected organization and emit outputs', () => {
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
      component.emitNavigateToLink(ShortUrl.Organization, Keyword.New);
      expect(component.navigateToLink.emit).toHaveBeenCalledTimes(1);
      expect(component.navigateToLink.emit).toHaveBeenCalledWith(
        `/${ShortUrl.Organization}/${Keyword.New}`,
      );
    });
  });
});
