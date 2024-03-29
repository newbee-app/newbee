import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CreateQnaComponent } from '@newbee/newbee/qna/ui';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testBaseCreateQnaDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QnaCreateComponent } from './qna-create.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('QnaCreateComponent', () => {
  let component: QnaCreateComponent;
  let fixture: ComponentFixture<QnaCreateComponent>;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQnaComponent],
      declarations: [QnaCreateComponent],
      providers: [
        provideMockStore(),
        provideRouter([{ path: '**', component: EmptyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QnaCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('onCreate', () => {
    it('should dispatch createQna', () => {
      component.onCreate(testBaseCreateQnaDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        QnaActions.createQna({ createQnaDto: testBaseCreateQnaDto1 }),
      );
    });
  });
});
