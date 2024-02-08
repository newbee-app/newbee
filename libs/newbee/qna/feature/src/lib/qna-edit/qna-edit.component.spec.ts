import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialQnaState as initialQnaModuleState } from '@newbee/newbee/qna/data-access';
import { EditQnaComponent } from '@newbee/newbee/qna/ui';
import {
  QnaActions,
  initialAuthState,
  initialHttpState,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testQnaRelation1,
  testUpdateAnswerDto1,
  testUpdateQuestionDto1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QnaEditComponent } from './qna-edit.component';

describe('QnaEditComponent', () => {
  let component: QnaEditComponent;
  let fixture: ComponentFixture<QnaEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQnaComponent],
      declarations: [QnaEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Qna]: {
              ...initialQnaState,
              selectedQna: testQnaRelation1,
            },
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
            [Keyword.Auth]: {
              ...initialAuthState,
              user: testUser1,
            },
            [`${Keyword.Qna}Module`]: initialQnaModuleState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QnaEditComponent);
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

  describe('onEditQuestion', () => {
    it('should dispatch editQuestion', () => {
      component.onEditQuestion(testUpdateQuestionDto1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        QnaActions.editQuestion({
          updateQuestionDto: testUpdateQuestionDto1,
        }),
      );
    });
  });

  describe('onEditAnswer', () => {
    it('should dispatch editAnswer', () => {
      component.onEditAnswer(testUpdateAnswerDto1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        QnaActions.editAnswer({ updateAnswerDto: testUpdateAnswerDto1 }),
      );
    });
  });

  describe('onMarkAsUpToDate', () => {
    it('should dispatch markQnaAsUpToDate', () => {
      component.onMarkAsUpToDate();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        QnaActions.markQnaAsUpToDate(),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteQna', () => {
      component.onDelete();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(QnaActions.deleteQna());
    });
  });
});
