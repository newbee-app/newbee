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

  describe('outputs', () => {
    describe('magicLinkLogin', () => {
      let magicLinkLoginEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        magicLinkLoginEmitSpy = jest.spyOn(component.magicLinkLogin, 'emit');
        component.loginForm.setValue({ email: testUser1.email });
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(magicLinkLoginEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitMagicLinkLogin()', () => {
        component.emitMagicLinkLogin();
        expect(magicLinkLoginEmitSpy).toHaveBeenCalledTimes(1);
        expect(magicLinkLoginEmitSpy).toHaveBeenCalledWith(
          component.loginForm.value,
        );
      });

      it('should emit the form value with button click', () => {
        const magicLinkLoginElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#magic-link-login-button');
        magicLinkLoginElement?.click();
        expect(magicLinkLoginEmitSpy).toHaveBeenCalledTimes(1);
        expect(magicLinkLoginEmitSpy).toHaveBeenCalledWith(
          component.loginForm.value,
        );
      });
    });

    describe('webauthn', () => {
      let webauthnEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        webauthnEmitSpy = jest.spyOn(component.webauthn, 'emit');
        component.loginForm.setValue({ email: testUser1.email });
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(webauthnEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitWebAuthn', () => {
        component.emitWebAuthn();
        expect(webauthnEmitSpy).toHaveBeenCalledTimes(1);
        expect(webauthnEmitSpy).toHaveBeenCalledWith(component.loginForm.value);
      });

      it('should emit the form value with button click', () => {
        const webauthnElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#webauthn-button');
        webauthnElement?.click();
        expect(webauthnEmitSpy).toHaveBeenCalledTimes(1);
        expect(webauthnEmitSpy).toHaveBeenCalledWith(component.loginForm.value);
      });
    });

    describe('navigateToRegister', () => {
      let navigateToRegisterEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        navigateToRegisterEmitSpy = jest.spyOn(
          component.navigateToRegister,
          'emit',
        );
      });

      it('should be defined', () => {
        expect(navigateToRegisterEmitSpy).toBeDefined();
      });

      it('should emit true using emitNavigateToRegister()', () => {
        component.emitNavigateToRegister();
        expect(navigateToRegisterEmitSpy).toHaveBeenCalledTimes(1);
        expect(navigateToRegisterEmitSpy).toHaveBeenCalledWith();
      });

      it('should emit true with link click', () => {
        const registerElement: HTMLAnchorElement | null =
          fixture.nativeElement.querySelector('#register-link');
        registerElement?.click();
        expect(navigateToRegisterEmitSpy).toHaveBeenCalledTimes(1);
        expect(navigateToRegisterEmitSpy).toHaveBeenCalledWith();
      });
    });
  });
});
