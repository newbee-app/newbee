import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    component.editAuthenticatorPending = new Map([
      [testAuthenticator1.id, false],
    ]);
    component.deleteAuthenticatorPending = new Map([
      [testAuthenticator1.id, false],
    ]);

    jest.spyOn(component.edit, 'emit');
    jest.spyOn(component.editAuthenticator, 'emit');
    jest.spyOn(component.deleteAuthenticator, 'emit');

    component.ngOnChanges({
      authenticators: new SimpleChange([], [testAuthenticator1], true),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should initialize authenticatorNames', () => {
      expect(component.editAuthenticatorForm.controls.names.length).toEqual(1);
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
          phoneNumber: testUser1.phoneNumber,
        });
      });
    });

    describe('emitEditAuthenticator', () => {
      it('should emit editAuthenticator', () => {
        component.startEditAuthenticator(testAuthenticator1.id);
        component.editAuthenticatorForm.controls.names
          .at(0)
          .setValue('new name');
        component.emitEditAuthenticator(0, testAuthenticator1.id);
        expect(component.editAuthenticator.emit).toBeCalledTimes(1);
        expect(component.editAuthenticator.emit).toBeCalledWith({
          id: testAuthenticator1.id,
          name: 'new name',
        });
        expect(component.editingAuthenticators.size).toEqual(0);
      });
    });
  });

  describe('editingAuthenticators', () => {
    it('startEditAuthenticator should add authenticator ID to editingAuthenticators', () => {
      component.startEditAuthenticator(testAuthenticator1.id);
      expect(
        component.editingAuthenticators.has(testAuthenticator1.id),
      ).toBeTruthy();
    });

    it('cancelEditAuthenticator should delete authenticator ID from editingAuthenticators', () => {
      component.cancelEditAuthenticator(testAuthenticator1.id);
      expect(
        component.editingAuthenticators.has(testAuthenticator1.id),
      ).toBeFalsy();
    });
  });

  describe('nameIsUnique', () => {
    it(`should return true if input's name is different than authenticator's name`, () => {
      expect(component.nameIsUnique(0, testAuthenticator1)).toBeFalsy();
      component.editAuthenticatorForm.controls.names.at(0).setValue('new name');
      expect(component.nameIsUnique(0, testAuthenticator1)).toBeTruthy();
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
