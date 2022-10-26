import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipComponentModule } from '@newbee/newbee/shared/ui';
import { testUser1 } from '@newbee/shared/util';
import { MagicLinkLoginBaseFormComponentModule } from '../../base-form';
import { MagicLinkLoginLoginFormComponent } from './magic-link-login-login-form.component';

const testEmail1 = testUser1.email;

describe('MagicLinkLoginLoginFormComponent', () => {
  let component: MagicLinkLoginLoginFormComponent;
  let fixture: ComponentFixture<MagicLinkLoginLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MagicLinkLoginBaseFormComponentModule,
        TooltipComponentModule,
        CommonModule,
        ReactiveFormsModule,
      ],
      declarations: [MagicLinkLoginLoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MagicLinkLoginLoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('email control', () => {
    it('should be empty initially', () => {
      expect(component.emailInputIsClean).toBeTruthy();
      expect(component.emailInputIsValid).toBeFalsy();
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
      component.email?.setValue(testEmail1);
      expect(component.email?.value).toEqual(testEmail1);
      expect(component.email?.valid).toBeTruthy();
      expect(component.email?.errors).toBeNull();
    });
  });

  describe('email tooltip', () => {
    let emailErrorElement: () => HTMLDivElement | null;

    beforeEach(() => {
      emailErrorElement = () =>
        fixture.nativeElement.querySelector(`#${component.tooltipIds.message}`);
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
      component.email?.setValue(testEmail1);
      fixture.detectChanges();
      expect(emailErrorElement()).toBeNull();
      expect(component.emailErrorMessage).toEqual('');
    });
  });

  describe('outputs', () => {
    describe('login', () => {
      let loginEmitSpy: jest.SpyInstance;

      beforeEach(() => {
        loginEmitSpy = jest.spyOn(component.login, 'emit');
        component.email?.setValue(testEmail1);
        fixture.detectChanges();
      });

      it('should be defined', () => {
        expect(loginEmitSpy).toBeDefined();
      });

      it('should emit the form value using emitLogin()', () => {
        component.emitLogin(component.loginForm.value);
        expect(loginEmitSpy).toBeCalledTimes(1);
        expect(loginEmitSpy).toBeCalledWith(component.loginForm.value);
      });

      it('should emit the form value with submit button click', () => {
        const submitElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#submit-button');
        submitElement?.click();
        expect(loginEmitSpy).toBeCalledTimes(1);
        expect(loginEmitSpy).toBeCalledWith(component.loginForm.value);
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
