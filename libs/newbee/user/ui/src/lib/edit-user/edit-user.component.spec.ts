import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testCountry1 } from '@newbee/newbee/shared/util';
import { testUser1, testUser2 } from '@newbee/shared/util';
import { EditUserComponent } from './edit-user.component';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;

    component.user = testUser1;

    jest.spyOn(component.edit, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('edit', () => {
    it('should emit edit', () => {
      component.emitEdit();
      expect(component.edit.emit).toBeCalledTimes(1);
      expect(component.edit.emit).toBeCalledWith({
        name: testUser1.name,
        displayName: testUser1.displayName,
        phoneNumber: {
          country: testCountry1,
          number: testUser1.phoneNumber?.slice(2),
        },
      });
    });
  });

  describe('editDistinct', () => {
    it('should be true when edit user form is distinct from user, false otherwise', () => {
      expect(component.editDistinct).toBeFalsy();
      component.editUserForm.patchValue({ name: testUser2.name });
      expect(component.editDistinct).toBeTruthy();
    });
  });
});
