import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QnaRootComponent } from './qna-root.component';

describe('QnaRootComponent', () => {
  let component: QnaRootComponent;
  let fixture: ComponentFixture<QnaRootComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [QnaRootComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(QnaRootComponent);
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

  describe('ngOnDestroy', () => {
    it('should dispatch resetSelectedQna', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toBeCalledWith(QnaActions.resetSelectedQna());
    });
  });
});
