import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtIdComponent } from '@newbee/newbee/auth/ui';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testEmailDto1, testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { ConfirmEmailComponent } from './confirm-email.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtIdComponent],
      declarations: [ConfirmEmailComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('jwtId and Email', () => {
    it('should set component properties', () => {
      store.setState({
        authModule: {
          jwtId: '1234',
          email: testUser1.email,
          pendingMagicLink: false,
          pendingWebAuthn: false,
        },
      });

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
              AuthActions.sendLoginMagicLink({ emailDto: testEmailDto1 }),
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
