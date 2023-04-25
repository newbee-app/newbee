import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testUser1 } from '@newbee/shared/util';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    component.loginPending = false;
    component.magicLinkPending = false;
    fixture.detectChanges();
  });

  it('should be defined', () => {
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
        component.emitMagicLinkLogin();
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

      it('should emit the form value using emitWebAuthn', () => {
        component.emitWebAuthn();
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
