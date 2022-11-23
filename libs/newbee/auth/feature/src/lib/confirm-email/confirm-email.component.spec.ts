import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { JwtIdComponentModule } from '@newbee/newbee/auth/ui';
import { testLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ConfirmEmailComponent } from './confirm-email.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtIdComponentModule],
      declarations: [ConfirmEmailComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('jwtId and Email', () => {
    it('should set component properties if jwtId and email are truthy', () => {
      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: '1234',
        email: testUser1.email,
      });
      store.refreshState();
      expect(component.jwtId).toEqual('1234');
      expect(component.email).toEqual(testUser1.email);
      expect(router.navigate).not.toBeCalled();
    });

    it('should navigate if either jwtId or email is falsy', () => {
      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: null,
        email: null,
      });
      store.refreshState();
      expect(component.jwtId).toBeUndefined();
      expect(component.email).toBeUndefined();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../']);

      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: null,
        email: testUser1.email,
      });
      store.refreshState();
      expect(component.jwtId).toBeUndefined();
      expect(component.email).toBeUndefined();
      expect(router.navigate).toBeCalledTimes(2);

      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: '1234',
        email: null,
      });
      store.refreshState();
      expect(component.jwtId).toBeUndefined();
      expect(component.email).toBeUndefined();
      expect(router.navigate).toBeCalledTimes(3);
    });
  });

  describe('onResendLink', () => {
    it('should dispatch sendLoginMagicLink', (done) => {
      component.onResendLink(testUser1.email);
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
});
