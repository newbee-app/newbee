import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testSelectOptionOrganization1,
  testSelectOptionOrganization2,
} from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

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
    component.organizations = [
      testSelectOptionOrganization1,
      testSelectOptionOrganization2,
    ];
    component.selectedOrganization = testSelectOptionOrganization1;
    jest.spyOn(component.selectedOrganizationChange, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('should start with correct values', () => {
    expect(component.organizationSelect.value).toEqual(
      testSelectOptionOrganization1.value
    );
  });

  it('should emit when a new organization is selected', () => {
    component.organizationSelect.setValue(testSelectOptionOrganization2.value);
    expect(component.selectedOrganization).toEqual(
      testSelectOptionOrganization2
    );
    expect(component.selectedOrganizationChange.emit).toBeCalledTimes(1);
    expect(component.selectedOrganizationChange.emit).toBeCalledWith(
      testSelectOptionOrganization2
    );
  });
});
