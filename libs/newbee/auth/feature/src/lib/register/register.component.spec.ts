import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/auth/data-access';
import { RegisterFormComponentModule } from '@newbee/newbee/auth/ui';
import { testRegisterForm1 } from '@newbee/newbee/auth/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponentModule],
      declarations: [RegisterComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
        { provide: ActivatedRoute, useValue: createMock<ActivatedRoute>() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  describe('onRegister', () => {
    it('should dispatch sendMagicLink action', (done) => {
      component.onRegister(testRegisterForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              AuthActions.getWebauthnRegisterChallenge({
                registerForm: testRegisterForm1,
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

  describe('onNavigateToLogin', () => {
    it('should call navigate', () => {
      component.onNavigateToLogin();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../login'], {
        relativeTo: route,
      });
    });
  });
});
