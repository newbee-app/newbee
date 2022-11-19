import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipComponentModule } from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { BaseFormComponentModule } from '../base-form';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TooltipComponentModule,
        BaseFormComponentModule,
      ],
      declarations: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should bedefined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('email control', () => {
    it('should be empty initially', () => {
      expect(component.showEmailError).toBeFalsy();
      expect(component.email?.hasError('required')).toBeTruthy();
      expect(component.email?.value).toEqual('');
    });

    it('should not accept non-email input', () => {
      const badEmail = 'johndoe';
      component.email?.setValue(badEmail);
      expect(component.email?.value).toEqual(badEmail);
      expect(component.email?.invalid).toBeTruthy();
      expect(component.email?.hasError('email')).toBeTruthy();
    });

    it('should accept valid email input', () => {
      component.email?.setValue(testUser1.email);
      expect(component.email?.value).toEqual(testUser1.email);
      expect(component.email?.valid).toBeTruthy();
      expect(component.email?.errors).toBeNull();
    });
  });

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
      expect(component.emailErrorMessage).toEqual('You must enter a value');
      expect(emailErrorElement()).toBeNull();
    });

    it('should be visible after dirty and touch', () => {
      component.email?.markAsDirty();
      component.email?.markAsTouched();
      fixture.detectChanges();
      const errorMessage = emailErrorElement();
      expect(errorMessage).not.toBeNull();
      expect(errorMessage?.innerHTML).toEqual('You must enter a value');
    });

    it('should be visible after just dirty', () => {
      component.email?.markAsDirty();
      fixture.detectChanges();
      expect(emailErrorElement()).not.toBeNull();
    });

    it('should be visible after just touch', () => {
      component.email?.markAsTouched();
      fixture.detectChanges();
      expect(emailErrorElement()).not.toBeNull();
    });

    it('should not accept non-email input', () => {
      const badEmail = 'johndoe';
      component.email?.setValue(badEmail);
      component.email?.markAsTouched();
      component.email?.markAsDirty();
      fixture.detectChanges();
      expect(emailErrorElement()).not.toBeNull();
      expect(component.emailErrorMessage).toEqual('Not a valid email');
      expect(emailErrorElement()?.innerHTML).toEqual('Not a valid email');
    });

    it('should accept valid email input', () => {
      component.email?.setValue(testUser1.email);
      fixture.detectChanges();
      expect(emailErrorElement()).toBeNull();
      expect(component.emailErrorMessage).toEqual('');
    });
  });

  describe('outputs', () => {
    describe('magicLinkLogin', () => {
      let magicLinkLoginEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        magicLinkLoginEmitSpy = jest.spyOn(component.magicLinkLogin, 'emit');
        component.email?.setValue(testUser1.email);
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(magicLinkLoginEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitMagicLinkLogin()', () => {
        component.emitMagicLinkLogin(component.loginForm.value);
        expect(magicLinkLoginEmitSpy).toBeCalledTimes(1);
        expect(magicLinkLoginEmitSpy).toBeCalledWith(component.loginForm.value);
      });

      it('should emit the form value with button click', () => {
        const magicLinkLoginElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#magic-link-login-button');
        magicLinkLoginElement?.click();
        expect(magicLinkLoginEmitSpy).toBeCalledTimes(1);
        expect(magicLinkLoginEmitSpy).toBeCalledWith(component.loginForm.value);
      });
    });

    describe('webauthn', () => {
      let webauthnEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        webauthnEmitSpy = jest.spyOn(component.webauthn, 'emit');
        component.email?.setValue(testUser1.email);
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(webauthnEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitWebAuthn()', () => {
        component.emitWebAuthn(component.loginForm.value);
        expect(webauthnEmitSpy).toBeCalledTimes(1);
        expect(webauthnEmitSpy).toBeCalledWith(component.loginForm.value);
      });

      it('should emit the form value with button click', () => {
        const webauthnElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#webauthn-button');
        webauthnElement?.click();
        expect(webauthnEmitSpy).toBeCalledTimes(1);
        expect(webauthnEmitSpy).toBeCalledWith(component.loginForm.value);
      });
    });

    describe('navigateToRegister', () => {
      let navigateToRegisterEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        navigateToRegisterEmitSpy = jest.spyOn(
          component.navigateToRegister,
          'emit'
        );
      });

      it('should be defined', () => {
        expect(navigateToRegisterEmitSpy).toBeDefined();
      });

      it('should emit true using emitNavigateToRegister()', () => {
        component.emitNavigateToRegister();
        expect(navigateToRegisterEmitSpy).toBeCalledTimes(1);
        expect(navigateToRegisterEmitSpy).toBeCalledWith();
      });

      it('should emit true with link click', () => {
        const registerElement: HTMLAnchorElement | null =
          fixture.nativeElement.querySelector('#register-link');
        registerElement?.click();
        expect(navigateToRegisterEmitSpy).toBeCalledTimes(1);
        expect(navigateToRegisterEmitSpy).toBeCalledWith();
      });
    });
  });
});
