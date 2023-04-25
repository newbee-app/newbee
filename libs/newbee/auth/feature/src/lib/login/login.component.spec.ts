import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { LoginFormComponent } from '@newbee/newbee/auth/ui';
import { testLoginForm1 } from '@newbee/newbee/auth/util';
import { AppActions, AuthActions } from '@newbee/newbee/shared/data-access';
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

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('init', () => {
    it('should dispatch resetPendingActions', (done) => {
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(AppActions.resetPendingActions());
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });

  describe('onWebAuthn', () => {
    it('should dispatch createWebauthnLoginOptions', (done) => {
      component.onWebAuthn(testLoginForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              AuthActions.createWebauthnLoginOptions({
                loginForm: testLoginForm1,
              })
            );
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });

  describe('onMagicLinkLogin', () => {
    it('should dispatch sendLoginMagicLink action', (done) => {
      component.onMagicLinkLogin(testLoginForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              AuthActions.sendLoginMagicLink({ loginForm: testLoginForm1 })
            );
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });

  describe('onNavigateToRegister', () => {
    it('should call navigate', () => {
      expect(component).toBeDefined();
      component.onNavigateToRegister();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../register'], {
        relativeTo: route,
      });
    });
  });
});
