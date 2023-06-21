import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { RegisterFormComponent } from '@newbee/newbee/auth/ui';
import { testRegisterForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testBaseCreateUserDto1 } from '@newbee/shared/data-access';
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
      imports: [RegisterFormComponent],
      declarations: [RegisterComponent],
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

    fixture = TestBed.createComponent(RegisterComponent);
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

  describe('onRegister', () => {
    it('should dispatch registerWithWebauthn action', () => {
      component.onRegister(testRegisterForm1);
      expect(store.dispatch).toBeCalledWith(
        AuthActions.registerWithWebauthn({
          createUserDto: testBaseCreateUserDto1,
        })
      );
    });
  });

  describe('onNavigateToLogin', () => {
    it('should call navigate', async () => {
      await component.onNavigateToLogin();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../login'], {
        relativeTo: route,
      });
    });
  });
});
