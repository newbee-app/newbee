import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialQnaState as initialQnaModuleState } from '@newbee/newbee/qna/data-access';
import { EditQnaComponent } from '@newbee/newbee/qna/ui';
import {
  QnaActions,
  initialHttpState,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  testBaseUpdateAnswerDto1,
  testBaseUpdateQuestionDto1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testQnaRelation1,
  testTeamMember1,
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
              teamMember: testTeamMember1,
            },
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
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
  });

  describe('onEditQuestion', () => {
    it('should dispatch editQuestion', () => {
      component.onEditQuestion(testBaseUpdateQuestionDto1);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        QnaActions.editQuestion({
          updateQuestionDto: testBaseUpdateQuestionDto1,
        }),
      );
    });
  });

  describe('onEditAnswer', () => {
    it('should dispatch editAnswer', () => {
      component.onEditAnswer(testBaseUpdateAnswerDto1);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        QnaActions.editAnswer({ updateAnswerDto: testBaseUpdateAnswerDto1 }),
      );
    });
  });

  describe('onMarkAsUpToDate', () => {
    it('should dispatch markQnaAsUpToDate', () => {
      component.onMarkAsUpToDate();
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(QnaActions.markQnaAsUpToDate());
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteQna', () => {
      component.onDelete();
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(QnaActions.deleteQna());
    });
  });
});
