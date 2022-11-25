import { ComponentFixture, TestBed } from '@angular/core/testing';
import { authFeature } from '@newbee/newbee/auth/data-access';
import { JwtIdComponentModule } from '@newbee/newbee/auth/ui';
import { testLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { ConfirmEmailComponent } from './confirm-email.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtIdComponentModule],
      declarations: [ConfirmEmailComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('jwtId and Email', () => {
    it('should set component properties', () => {
      store.overrideSelector(authFeature.selectAuthState, {
        jwtId: '1234',
        email: testUser1.email,
      });
      store.refreshState();

      expect(component.jwtId$).toBeObservable(hot('a', { a: '1234' }));
      expect(component.email$).toBeObservable(hot('a', { a: testUser1.email }));
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
