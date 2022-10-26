import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/auth/data-access';
import { MagicLinkLoginLoginFormComponentModule } from '@newbee/newbee/auth/ui';
import { testMagicLinkLoginLoginForm1 } from '@newbee/newbee/auth/util';
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
      imports: [MagicLinkLoginLoginFormComponentModule],
      declarations: [LoginComponent],
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

  describe('onLogin', () => {
    it('should dispatch sendLoginMagicLink action', (done) => {
      component.onLogin(testMagicLinkLoginLoginForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              AuthActions.sendLoginMagicLink(testMagicLinkLoginLoginForm1)
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
