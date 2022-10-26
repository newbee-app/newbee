import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
  PhoneInputComponentModule,
  TooltipComponentModule,
} from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { MagicLinkLoginBaseFormComponentModule } from '../../base-form';
import { MagicLinkLoginRegisterFormComponent } from './magic-link-login-register-form.component';

const {
  email: testEmail1,
  name: testName1,
  displayName: testDisplayName1,
} = testUser1;

describe('MagicLinkLoginRegisterFormComponent', () => {
  let component: MagicLinkLoginRegisterFormComponent;
  let fixture: ComponentFixture<MagicLinkLoginRegisterFormComponent>;
  let emailControl: AbstractControl | null;
  let nameControl: AbstractControl | null;
  let displayNameControl: AbstractControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MagicLinkLoginBaseFormComponentModule,
        TooltipComponentModule,
        PhoneInputComponentModule,
      ],
      declarations: [MagicLinkLoginRegisterFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MagicLinkLoginRegisterFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    emailControl = component.registerForm.get('email');
    nameControl = component.registerForm.get('name');
    displayNameControl = component.registerForm.get('displayName');
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('controls', () => {
    describe('email', () => {
      it('should be empty initially', () => {
        expect(component.inputIsClean('email')).toBeTruthy();
        expect(component.inputIsValid('email')).toBeFalsy();
        expect(emailControl?.hasError('required')).toBeTruthy();
        expect(emailControl?.value).toEqual('');
      });

      it('should not accept non-email input', () => {
        const badEmail = 'johndoe';
        emailControl?.setValue(badEmail);
        expect(emailControl?.value).toEqual(badEmail);
        expect(emailControl?.invalid).toBeTruthy();
        expect(emailControl?.hasError('email')).toBeTruthy();
      });

      it('should accept valid email input', () => {
        emailControl?.setValue(testEmail1);
        expect(emailControl?.value).toEqual(testEmail1);
        expect(emailControl?.valid).toBeTruthy();
        expect(emailControl?.errors).toBeNull();
      });
    });

    describe('name', () => {
      it('should be empty initially', () => {
        expect(component.inputIsClean('name')).toBeTruthy();
        expect(component.inputIsValid('name')).toBeFalsy();
        expect(nameControl?.hasError('required')).toBeTruthy();
        expect(nameControl?.value).toEqual('');
      });

      it('should accept any name', () => {
        nameControl?.setValue(testName1);
        expect(nameControl?.value).toEqual(testName1);
        expect(nameControl?.valid).toBeTruthy();
        expect(nameControl?.errors).toBeNull();
      });
    });

    describe('display name', () => {
      it('should be empty initially', () => {
        expect(component.inputIsClean('displayName')).toBeTruthy();
        expect(component.inputIsValid('displayName')).toBeTruthy();
        expect(displayNameControl?.value).toEqual('');
      });

      it('should accept any displayName', () => {
        displayNameControl?.setValue(testDisplayName1);
        fixture.detectChanges();
        expect(displayNameControl?.value).toEqual(testDisplayName1);
        expect(displayNameControl?.valid).toBeTruthy();
        expect(displayNameControl?.errors).toBeNull();
      });
    });
  });

  describe('tooltips', () => {
    describe('email tooltip', () => {
      let emailErrorElement: () => HTMLDivElement | null;

      beforeEach(() => {
        emailErrorElement = () =>
          fixture.nativeElement.querySelector(
            `#${component.tooltipIds.email.message}`
          );
      });

      it('should be defined', () => {
        expect(emailErrorElement).toBeDefined();
      });

      it('should not be visible initially', () => {
        expect(component.inputErrorMessage('email')).toEqual(
          'You must enter a value'
        );
        expect(emailErrorElement()).toBeNull();
      });

      it('should be visible after dirty and touch', () => {
        emailControl?.markAsDirty();
        emailControl?.markAsTouched();
        fixture.detectChanges();
        const errorMessage = emailErrorElement();
        expect(errorMessage).not.toBeNull();
        expect(errorMessage?.innerHTML).toEqual('You must enter a value');
      });

      it('should be visible after just dirty', () => {
        emailControl?.markAsDirty();
        fixture.detectChanges();
        expect(emailErrorElement()).not.toBeNull();
      });

      it('should be visible after just touch', () => {
        emailControl?.markAsTouched();
        fixture.detectChanges();
        expect(emailErrorElement()).not.toBeNull();
      });

      it('should not accept non-email input', () => {
        const badEmail = 'johndoe';
        emailControl?.setValue(badEmail);
        emailControl?.markAsTouched();
        emailControl?.markAsDirty();
        fixture.detectChanges();
        expect(emailErrorElement()).not.toBeNull();
        expect(component.inputErrorMessage('email')).toEqual(
          'Not a valid email'
        );
        expect(emailErrorElement()?.innerHTML).toEqual('Not a valid email');
      });

      it('should accept valid email input', () => {
        emailControl?.setValue(testEmail1);
        fixture.detectChanges();
        expect(emailErrorElement()).toBeNull();
        expect(component.inputErrorMessage('email')).toEqual('');
      });
    });

    describe('name tooltip', () => {
      let nameErrorElement: () => HTMLDivElement | null;

      beforeEach(() => {
        nameErrorElement = () =>
          fixture.nativeElement.querySelector(
            `#${component.tooltipIds.name.message}`
          );
      });

      it('should be defined', () => {
        expect(nameErrorElement).toBeDefined();
      });

      it('should not be visible initially', () => {
        expect(component.inputErrorMessage('name')).toEqual(
          'You must enter a value'
        );
        expect(nameErrorElement()).toBeNull();
      });

      it('should be visible after dirty and touch', () => {
        nameControl?.markAsDirty();
        nameControl?.markAsTouched();
        fixture.detectChanges();
        const errorMessage = nameErrorElement();
        expect(errorMessage).not.toBeNull();
        expect(errorMessage?.innerHTML).toEqual('You must enter a value');
      });

      it('should be visible after just dirty', () => {
        nameControl?.markAsDirty();
        fixture.detectChanges();
        expect(nameErrorElement()).not.toBeNull();
      });

      it('should be visible after just touch', () => {
        nameControl?.markAsTouched();
        fixture.detectChanges();
        expect(nameErrorElement()).not.toBeNull();
      });

      it('should accept any name input', () => {
        nameControl?.setValue(testName1);
        fixture.detectChanges();
        expect(nameErrorElement()).toBeNull();
        expect(component.inputErrorMessage('name')).toEqual('');
      });
    });
  });

  describe('outputs', () => {
    describe('register', () => {
      let registerEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        registerEmitSpy = jest.spyOn(component.register, 'emit');
        emailControl?.setValue(testEmail1);
        nameControl?.setValue(testName1);
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(registerEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitregister()', () => {
        component.emitRegister(component.registerForm.value);
        expect(registerEmitSpy).toBeCalledTimes(1);
        expect(registerEmitSpy).toBeCalledWith(component.registerForm.value);
      });

      it('should emit the form value with submit button click', () => {
        const submitElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#submit-button');
        submitElement?.click();
        expect(registerEmitSpy).toBeCalledTimes(1);
        expect(registerEmitSpy).toBeCalledWith(component.registerForm.value);
      });
    });

    describe('navigateToLogin', () => {
      let navigateToLoginEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        navigateToLoginEmitSpy = jest.spyOn(component.navigateToLogin, 'emit');
      });

      it('should be defined', () => {
        expect(navigateToLoginEmitSpy).toBeDefined();
      });

      it('should emit true using emitNavigateToLogin()', () => {
        component.emitNavigateToLogin();
        expect(navigateToLoginEmitSpy).toBeCalledTimes(1);
        expect(navigateToLoginEmitSpy).toBeCalledWith();
      });

      it('should emit true with link click', () => {
        const loginElement: HTMLAnchorElement | null =
          fixture.nativeElement.querySelector('#login-link');
        loginElement?.click();
        expect(navigateToLoginEmitSpy).toBeCalledTimes(1);
        expect(navigateToLoginEmitSpy).toBeCalledWith();
      });
    });
  });
});
