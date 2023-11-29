import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  testOrgMember1,
  testOrganization1,
  testQna1,
  testQnaRelation1,
  testTeam1,
} from '@newbee/shared/util';
import { EditQnaComponent } from './edit-qna.component';

describe('EditQnaComponent', () => {
  let component: EditQnaComponent;
  let fixture: ComponentFixture<EditQnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQnaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditQnaComponent);
    component = fixture.componentInstance;

    component.qna = testQnaRelation1;
    component.orgMember = testOrgMember1;
    component.teams = [testTeam1];
    component.organization = testOrganization1;

    jest.spyOn(component.editQuestion, 'emit');
    jest.spyOn(component.editAnswer, 'emit');
    jest.spyOn(component.markAsUpToDate, 'emit');
    jest.spyOn(component.delete, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should fill information with qna values if permissions are right', () => {
      expect(component.questionMarkdoc).toEqual(testQna1.questionMarkdoc);
      expect(component.teamOptions).toEqual([
        new SelectOption(null, 'Entire org'),
        new SelectOption(testTeam1, testTeam1.name),
      ]);
      expect(component.editQuestionForm.value).toEqual({
        title: testQna1.title,
        team: testQnaRelation1.team,
      });
      expect(component.editAnswerForm.value).toEqual({
        upToDateDuration: { num: null, frequency: null },
      });
      expect(component.answerMarkdoc).toEqual(testQna1.answerMarkdoc);
    });
  });

  describe('emitEditQuestion', () => {
    it('should emit question values', () => {
      component.emitEditQuestion();
      expect(component.editQuestion.emit).toBeCalledTimes(1);
      expect(component.editQuestion.emit).toBeCalledWith({
        title: testQna1.title,
        questionMarkdoc: testQna1.questionMarkdoc,
        team: testQnaRelation1.team?.slug || null,
      });
    });
  });

  describe('emitEditAnswer', () => {
    it('should emit answer values', () => {
      component.emitEditAnswer();
      expect(component.editAnswer.emit).toBeCalledTimes(1);
      expect(component.editAnswer.emit).toBeCalledWith({
        answerMarkdoc: testQna1.answerMarkdoc,
        upToDateDuration: testQna1.upToDateDuration,
      });
    });
  });
});
