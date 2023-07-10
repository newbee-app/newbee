import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testPhoneInput1 } from '@newbee/newbee/shared/util';
import { testUser1, testUser2 } from '@newbee/shared/util';
import { EditUserComponent } from './edit-user.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

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
    jest.spyOn(component.delete, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('outputs', () => {
    describe('emitEdit', () => {
      it('should emit edit', () => {
        component.emitEdit();
        expect(component.edit.emit).toBeCalledTimes(1);
        expect(component.edit.emit).toBeCalledWith({
          name: testUser1.name,
          displayName: testUser1.displayName,
          phoneNumber: testPhoneInput1,
        });
      });
    });

    describe('emitDelete', () => {
      it('should emit delete', () => {
        component.emitDelete();
        expect(component.delete.emit).toBeCalledTimes(1);
        expect(component.delete.emit).toBeCalledWith();
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
