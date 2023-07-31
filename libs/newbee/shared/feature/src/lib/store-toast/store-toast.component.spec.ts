import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastActions } from '@newbee/newbee/shared/data-access';
import { testToast1 } from '@newbee/newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreToastComponent } from './store-toast.component';

describe('StoreToastComponent', () => {
  let component: StoreToastComponent;
  let fixture: ComponentFixture<StoreToastComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreToastComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreToastComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onDismissed', () => {
    it('should dispatch removeToast', () => {
      component.onDismissed(testToast1.id);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        ToastActions.removeToast({ id: testToast1.id })
      );
    });
  });
});
