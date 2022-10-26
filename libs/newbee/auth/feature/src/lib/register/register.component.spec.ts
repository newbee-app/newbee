import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MagicLinkLoginLoginFormComponentModule } from '@newbee/newbee/auth/ui';
import { testMagicLinkLoginLoginForm1 } from '@newbee/newbee/auth/util';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MagicLinkLoginLoginFormComponentModule],
      declarations: [RegisterComponent],
      providers: [provideMockStore()],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onRegister', () => {
    it('should dispatch sendMagicLink action', (done) => {
      component.onRegister(testMagicLinkLoginLoginForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          expect(scannedAction).toEqual(
            AuthActions.sendRegisterMagicLink(testMagicLinkLoginLoginForm1)
          );
          done();
        },
        error: done.fail,
      });
    });
  });
});
