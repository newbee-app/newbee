import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testPhoneInput1 } from '@newbee/newbee/shared/util';
import { testAuthenticator1, testUser1, testUser2 } from '@newbee/shared/util';
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
    component.authenticators = [testAuthenticator1];

    jest.spyOn(component.edit, 'emit');
    jest.spyOn(component.updateName, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should initialize authenticatorNames', () => {
      expect(
        testAuthenticator1.id in component.authenticatorNames
      ).toBeTruthy();
    });
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

    describe('emitUpdateName', () => {
      it('should emit updateName', () => {
        component.editingAuthenticators.add(testAuthenticator1.id);
        component.authenticatorNames[testAuthenticator1.id]?.setValue(
          'new name'
        );
        component.emitUpdateName(testAuthenticator1.id);
        expect(component.updateName.emit).toBeCalledTimes(1);
        expect(component.updateName.emit).toBeCalledWith({
          id: testAuthenticator1.id,
          name: 'new name',
        });
        expect(component.editingAuthenticators.size).toEqual(0);
      });
    });
  });

  describe('editingAuthenticators', () => {
    it('editAuthenticator should add authenticator ID to editingAuthenticators', () => {
      component.editAuthenticator(testAuthenticator1.id);
      expect(
        component.editingAuthenticators.has(testAuthenticator1.id)
      ).toBeTruthy();
    });

    it('cancelEditAuthenticator should delete authenticator ID from editingAuthenticators', () => {
      component.cancelEditAuthenticator(testAuthenticator1.id);
      expect(
        component.editingAuthenticators.has(testAuthenticator1.id)
      ).toBeFalsy();
    });
  });

  describe('nameIsUnique', () => {
    it(`should return true if input's name is different than authenticator's name`, () => {
      expect(component.nameIsUnique(testAuthenticator1)).toBeFalsy();
      component.authenticatorNames[testAuthenticator1.id]?.setValue('new name');
      expect(component.nameIsUnique(testAuthenticator1)).toBeTruthy();
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
