import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testSelectOptionString1,
  testSelectOptionString2,
} from '@newbee/newbee/shared/util';
import { AuthenticatedOrganizationComponent } from './authenticated-organization.component';

describe('AuthenticatedOrganizationComponent', () => {
  let component: AuthenticatedOrganizationComponent;
  let fixture: ComponentFixture<AuthenticatedOrganizationComponent>;

  const testOptions = [testSelectOptionString1, testSelectOptionString2];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedOrganizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedOrganizationComponent);
    component = fixture.componentInstance;

    component.organizations = testOptions;
    component.selectedOrganization = testSelectOptionString1;
    jest.spyOn(component.selectedOrganizationChange, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('should initialize with expected values', () => {
    expect(component.organizations).toEqual(testOptions);
    expect(component.selectedOrganization).toEqual(testSelectOptionString1);
  });

  it('selectOption should emit selectedOrganizationChange', () => {
    component.selectOption(testSelectOptionString2.value);
    expect(component.selectedOrganizationChange.emit).toBeCalledTimes(1);
    expect(component.selectedOrganizationChange.emit).toBeCalledWith(
      testSelectOptionString2
    );
  });
});
