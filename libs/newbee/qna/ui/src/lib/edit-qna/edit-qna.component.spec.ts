import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  Frequency,
  testOrgMember1,
  testOrganization1,
  testQna1,
  testQnaRelation1,
  testTeam1,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
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

  describe('upToDateDurationTagline', () => {
    it(`should vary based on the qna's team and up-to-date duration`, () => {
      expect(component.upToDateDurationTagline).toEqual(
        `Mark blank to default to the organization's value of ${dayjs
          .duration(testOrganization1.upToDateDuration)
          .humanize()}`,
      );

      const newDuration = dayjs.duration(2, 'months');
      component.qna = {
        ...testQnaRelation1,
        team: { ...testTeam1, upToDateDuration: newDuration.toISOString() },
      };
      expect(component.upToDateDurationTagline).toEqual(
        `Mark blank to default to the team's value of ${newDuration.humanize()}`,
      );
    });
  });

  describe('editQuestionDistinct', () => {
    it(`should be true if the qna's question is distinct from the edit's current value`, () => {
      expect(component.editQuestionDistinct).toBeFalsy();

      component.editQuestionForm.patchValue({ title: 'New value' });
      expect(component.editQuestionDistinct).toBeTruthy();

      component.editQuestionForm.setValue({
        title: testQna1.title,
        team: { name: 'New team', slug: 'new-team', upToDateDuration: null },
      });
      expect(component.editQuestionDistinct).toBeTruthy();

      component.editQuestionForm.patchValue({ team: testTeam1 });
      component.questionMarkdoc = 'New markdoc';
      expect(component.editQuestionDistinct).toBeTruthy();
    });
  });

  describe('editAnswerDistinct', () => {
    it(`should be true if the qna's answer is distinct from the edit's current value`, () => {
      expect(component.editAnswerDistinct).toBeFalsy();

      component.answerMarkdoc = 'new markdoc';
      expect(component.editAnswerDistinct).toBeTruthy();

      component.answerMarkdoc = testQna1.answerMarkdoc ?? '';
      component.editAnswerForm.setValue({
        upToDateDuration: { num: 1, frequency: Frequency.Year },
      });
      expect(component.editAnswerDistinct).toBeTruthy();
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
