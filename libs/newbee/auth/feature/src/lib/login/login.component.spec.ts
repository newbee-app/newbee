import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LoginFormComponent } from '@newbee/newbee/auth/ui';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Keyword, testBaseEmailDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      declarations: [LoginComponent],
      providers: [
        provideMockStore(),
        provideRouter([{ path: '**', component: LoginComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${Keyword.Auth}/${Keyword.Login}`,
      LoginComponent,
    );
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onWebAuthn', () => {
    it('should dispatch createWebAuthnLoginOptions', () => {
      component.onWebAuthn(testBaseEmailDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.createWebAuthnLoginOptions({ emailDto: testBaseEmailDto1 }),
      );
    });
  });

  describe('onMagicLinkLogin', () => {
    it('should dispatch sendLoginMagicLink action', () => {
      component.onMagicLinkLogin(testBaseEmailDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.sendLoginMagicLink({ emailDto: testBaseEmailDto1 }),
      );
    });
  });

  describe('onNavigateToRegister', () => {
    it('should call navigate', async () => {
      await component.onNavigateToRegister();
      expect(router.url).toEqual(`/${Keyword.Auth}/${Keyword.Register}`);
    });
  });
});
