import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import {
  testOrgMemberUser1,
  testOrganization1,
  testQna1,
  testQnaRelation1,
  testTeam1,
  userDisplayName,
  userDisplayNameAndEmail,
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
    component.orgMember = testOrgMemberUser1;
    component.teams = [testTeam1];
    component.orgMembers = [testOrgMemberUser1];
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

  describe('setters', () => {
    it('should set up select options', () => {
      expect(component.teamOptions).toEqual([
        new SelectOption(null, 'Entire org'),
        new SelectOption(testTeam1, testTeam1.name),
      ]);
      expect(component.orgMemberOptions).toEqual([
        new SelectOption(
          testOrgMemberUser1,
          userDisplayNameAndEmail(testOrgMemberUser1.user),
          userDisplayName(testOrgMemberUser1.user),
        ),
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should fill information with qna values if permissions are right', () => {
      expect(component.questionMarkdoc).toEqual(testQna1.questionMarkdoc);
      expect(component.editQuestionForm.value).toEqual({
        title: testQna1.title,
        team: testQnaRelation1.team,
      });
      expect(component.answerMarkdoc).toEqual(testQna1.answerMarkdoc);
      expect(component.editAnswerForm.value).toEqual({
        maintainer: testOrgMemberUser1,
        upToDateDuration: { num: null, frequency: null },
      });
    });
  });

  describe('emitEditQuestion', () => {
    it('should emit question values', () => {
      component.emitEditQuestion();
      expect(component.editQuestion.emit).toHaveBeenCalledTimes(1);
      expect(component.editQuestion.emit).toHaveBeenCalledWith({
        title: testQna1.title,
        questionMarkdoc: testQna1.questionMarkdoc,
        team: testQnaRelation1.team?.slug || null,
      });
    });
  });

  describe('emitEditAnswer', () => {
    it('should emit answer values', () => {
      component.emitEditAnswer();
      expect(component.editAnswer.emit).toHaveBeenCalledTimes(1);
      expect(component.editAnswer.emit).toHaveBeenCalledWith({
        answerMarkdoc: testQna1.answerMarkdoc,
        maintainer: testQnaRelation1.maintainer?.orgMember.slug,
        upToDateDuration: testQna1.upToDateDuration,
      });
    });
  });
});
