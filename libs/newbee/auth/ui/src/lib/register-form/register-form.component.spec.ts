import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testPhoneInput1 } from '@newbee/newbee/shared/util';
import { testCreateUserDto1, testUser1 } from '@newbee/shared/util';
import { RegisterFormComponent } from './register-form.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;

    component.registerPending = false;

    jest.spyOn(component.register, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('outputs', () => {
    describe('register', () => {
      beforeEach(() => {
        const { email, name, displayName } = testUser1;
        component.registerForm.setValue({
          email,
          name,
          displayName,
          phoneNumber: testPhoneInput1,
        });
        fixture.detectChanges();
      });

      it('should emit the form as a DTO using emitregister()', () => {
        component.emitRegister();
        expect(component.register.emit).toHaveBeenCalledTimes(1);
        expect(component.register.emit).toHaveBeenCalledWith(
          testCreateUserDto1,
        );
      });

      it('should emit the form as a DTO with submit button click', () => {
        const submitElement: HTMLButtonElement | null =
          fixture.nativeElement.querySelector('#submit-button');
        submitElement?.click();
        expect(component.register.emit).toHaveBeenCalledTimes(1);
        expect(component.register.emit).toHaveBeenCalledWith(
          testCreateUserDto1,
        );
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
        expect(navigateToLoginEmitSpy).toHaveBeenCalledTimes(1);
        expect(navigateToLoginEmitSpy).toHaveBeenCalledWith();
      });

      it('should emit true with link click', () => {
        const loginElement: HTMLAnchorElement | null =
          fixture.nativeElement.querySelector('#login-link');
        loginElement?.click();
        expect(navigateToLoginEmitSpy).toHaveBeenCalledTimes(1);
        expect(navigateToLoginEmitSpy).toHaveBeenCalledWith();
      });
    });
  });
});
