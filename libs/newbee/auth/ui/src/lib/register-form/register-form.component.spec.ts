import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { testUser1 } from '@newbee/shared/util';
import { RegisterFormComponent } from './register-form.component';

const {
  email: testEmail1,
  name: testName1,
  displayName: testDisplayName1,
} = testUser1;

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let emailControl: AbstractControl | null;
  let nameControl: AbstractControl | null;
  let displayNameControl: AbstractControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;

    component.registerPending = false;
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
        component.emitRegister();
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
