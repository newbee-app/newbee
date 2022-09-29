import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { testUser1 } from '@newbee/shared/util';
import { MagicLinkLoginLoginFormComponent } from './magic-link-login-login-form.component';

const testEmail1 = testUser1.email;
const testButtonText = 'Submit';

describe('MagicLinkLoginLoginFormComponent', () => {
  let fixture: ComponentFixture<MagicLinkLoginLoginFormComponent>;
  let component: MagicLinkLoginLoginFormComponent;
  let emailElement: HTMLInputElement | null;
  let errorMessageElement: () => HTMLElement | null;
  let expectedEmail = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [MagicLinkLoginLoginFormComponent],
    });

    fixture = TestBed.createComponent(MagicLinkLoginLoginFormComponent);
    component = fixture.componentInstance;
    component.onSubmit = (formValues) => {
      expect(formValues.email).toEqual(expectedEmail);
    };
    component.buttonText = testButtonText;

    fixture.detectChanges();

    emailElement = fixture.nativeElement.querySelector('#email-input');
    errorMessageElement = () => {
      return fixture.nativeElement.querySelector('#error-message');
    };
  });

  it('should be defined', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    expect(component.onSubmit).toBeDefined();
    expect(component.buttonText).toBeDefined();
    expect(emailElement).toBeDefined();
    expect(errorMessageElement).toBeDefined();
  });

  describe('button', () => {
    it('should use buttonText', () => {
      const buttonElement: HTMLButtonElement | null =
        fixture.nativeElement.querySelector('#submit-button');
      expect(buttonElement?.textContent).toEqual(testButtonText);
    });
  });

  describe('email()', () => {
    it('should be empty initially', () => {
      expect(component.email?.pristine).toBeTruthy();
      expect(component.email?.invalid).toBeTruthy();
      expect(component.email?.untouched).toBeTruthy();
      expect(component.email?.hasError('required')).toBeTruthy();
      expect(emailElement?.value).toEqual('');
      component.onSubmit(component.loginForm.value);
    });

    it('should not accept non-email input', () => {
      const badEmail = 'johndoe';
      component.email?.setValue(badEmail);
      fixture.detectChanges();
      expect(component.email?.value).toEqual(badEmail);
      expect(component.email?.invalid).toBeTruthy();
      expect(component.email?.hasError('email')).toBeTruthy();
      expect(emailElement?.value).toEqual(badEmail);
      expectedEmail = badEmail;
      component.onSubmit(component.loginForm.value);
    });

    it('should accept valid email input', () => {
      component.email?.setValue(testEmail1);
      fixture.detectChanges();
      expect(component.email?.value).toEqual(testEmail1);
      expect(component.email?.valid).toBeTruthy();
      expect(component.email?.errors).toBeNull();
      expect(emailElement?.value).toEqual(testEmail1);
      expectedEmail = testEmail1;
      component.onSubmit(component.loginForm.value);
    });
  });

  describe('errorMessage()', () => {
    it('should not be visible initially', () => {
      expect(component.errorMessage).toEqual('You must enter a value');
      expect(errorMessageElement()).toBeNull();
    });

    it('should be visible after user interaction', () => {
      component.email?.markAsTouched();
      component.email?.markAsDirty();
      fixture.detectChanges();
      expect(errorMessageElement()).not.toBeNull();
      expect(errorMessageElement()?.innerHTML).toEqual(
        'You must enter a value'
      );
    });

    it('should not accept non-email input', () => {
      const badEmail = 'johndoe';
      component.email?.setValue(badEmail);
      component.email?.markAsTouched();
      component.email?.markAsDirty();
      fixture.detectChanges();
      expect(errorMessageElement()).not.toBeNull();
      expect(component.errorMessage).toEqual('Not a valid email');
      expect(errorMessageElement()?.innerHTML).toEqual('Not a valid email');
    });

    it('should accept valid email input', () => {
      component.email?.setValue(testEmail1);
      fixture.detectChanges();
      expect(errorMessageElement()).toBeNull();
      expect(component.errorMessage).toEqual('');
    });
  });
});
