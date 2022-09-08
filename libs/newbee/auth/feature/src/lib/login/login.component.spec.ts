import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MagicLinkLoginLoginFormModule } from '@newbee/newbee/auth/ui';
import { testMagicLinkLoginLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MagicLinkLoginLoginFormModule, MatListModule],
      declarations: [LoginComponent],
      providers: [provideMockStore()],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onSubmit()', () => {
    it('should dispatch sendMagicLink action', (done) => {
      component.onSubmit(testMagicLinkLoginLoginForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          expect(scannedAction).toEqual(
            AuthActions.sendMagicLink(testMagicLinkLoginLoginForm1)
          );
          done();
        },
        error: done.fail,
      });
    });
  });
});
