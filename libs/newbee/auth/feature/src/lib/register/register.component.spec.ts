import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RegisterFormComponent } from '@newbee/newbee/auth/ui';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Keyword, testCreateUserDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RegisterComponent } from './register.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      declarations: [RegisterComponent],
      providers: [
        provideMockStore(),
        provideRouter([{ path: '**', component: RegisterComponent }]),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${Keyword.Auth}/${Keyword.Register}`,
      RegisterComponent,
    );
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onRegister', () => {
    it('should dispatch registerWithWebAuthn action', () => {
      component.onRegister(testCreateUserDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.registerWithWebAuthn({
          createUserDto: testCreateUserDto1,
        }),
      );
    });
  });

  describe('onNavigateToLogin', () => {
    it('should call navigate', async () => {
      await component.onNavigateToLogin();
      expect(router.url).toEqual(`/${Keyword.Auth}/${Keyword.Login}`);
    });
  });
});
