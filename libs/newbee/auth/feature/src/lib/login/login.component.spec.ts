import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { LoginFormComponent } from '@newbee/newbee/auth/ui';
import { testLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testBaseEmailDto1 } from '@newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      declarations: [LoginComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('onWebAuthn', () => {
    it('should dispatch createWebauthnLoginOptions', () => {
      component.onWebAuthn(testLoginForm1);
      expect(store.dispatch).toBeCalledWith(
        AuthActions.createWebauthnLoginOptions({ emailDto: testBaseEmailDto1 })
      );
    });
  });

  describe('onMagicLinkLogin', () => {
    it('should dispatch sendLoginMagicLink action', () => {
      component.onMagicLinkLogin(testLoginForm1);
      expect(store.dispatch).toBeCalledWith(
        AuthActions.sendLoginMagicLink({ emailDto: testBaseEmailDto1 })
      );
    });
  });

  describe('onNavigateToRegister', () => {
    it('should call navigate', async () => {
      await component.onNavigateToRegister();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../register'], {
        relativeTo: route,
      });
    });
  });
});
