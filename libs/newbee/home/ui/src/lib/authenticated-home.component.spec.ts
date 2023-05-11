import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  testSelectOptionOrganization1,
  testSelectOptionOrganization2,
} from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { AuthenticatedHomeComponent } from './authenticated-home.component';

describe('AuthenticatedHomeComponent', () => {
  let component: AuthenticatedHomeComponent;
  let fixture: ComponentFixture<AuthenticatedHomeComponent>;

  const testOrganizations = [
    testSelectOptionOrganization1,
    testSelectOptionOrganization2,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedHomeComponent);
    component = fixture.componentInstance;

    component.user = testUser1;
    component.organizations = testOrganizations;
    component.selectedOrganization = testSelectOptionOrganization1;

    jest.spyOn(component.selectedOrganizationChange, 'emit');
    jest.spyOn(component.search, 'emit');
    jest.spyOn(component.suggest, 'emit');
    jest.spyOn(component.navigateToLink, 'emit');
    jest.spyOn(component.logout, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should have initialized properly', () => {
      expect(component.user).toEqual(testUser1);
      expect(component.organizations).toEqual(testOrganizations);
      expect(component.selectedOrganization).toEqual(
        testSelectOptionOrganization1
      );
      expect(component.searchTerm.value).toEqual('');
      expect(component.hasOrgs).toBeTruthy();
      expect(component.orgSelected).toBeTruthy();
    });
  });

  describe('hasOrgs', () => {
    it('should return false if no organizations', () => {
      component.organizations = [];
      expect(component.hasOrgs).toBeFalsy();
    });
  });

  describe('orgSelected', () => {
    it('should return false if no organization selected', () => {
      component.selectedOrganization = null;
      expect(component.orgSelected).toBeFalsy();
    });
  });

  describe('emitSearch', () => {
    let submitEvent: SubmitEvent;

    beforeEach(() => {
      submitEvent = createMock<SubmitEvent>();
    });

    afterEach(() => {
      expect(submitEvent.preventDefault).toBeCalledTimes(1);
    });

    it('should preventDefault but not emit', () => {
      component.emitSearch(submitEvent);
      expect(component.search.emit).toBeCalledTimes(0);
    });

    it('should preventDefault and emit', () => {
      component.searchTerm.setValue('search');
      component.emitSearch(submitEvent);
      expect(component.search.emit).toBeCalledTimes(1);
      expect(component.search.emit).toBeCalledWith(component.searchTerm.value);
    });
  });
});
