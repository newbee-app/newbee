import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption } from '@newbee/newbee/shared/util';
import { testTeam1 } from '@newbee/shared/util';
import { CreateQnaComponent } from './create-qna.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('CreateQnaComponent', () => {
  let component: CreateQnaComponent;
  let fixture: ComponentFixture<CreateQnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQnaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQnaComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.create, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should set team options', () => {
      component.teams = [testTeam1];
      expect(component.teamOptions).toEqual([
        new SelectOption(null, 'Entire org'),
        new SelectOption(testTeam1, testTeam1.name),
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize form team value', () => {
      expect(component.qnaForm.controls.team.value).toBeNull();

      component.teams = [testTeam1];
      component.teamSlugParam = testTeam1.slug;
      component.ngOnInit();
      expect(component.qnaForm.controls.team.value).toEqual(testTeam1);
    });
  });

  describe('createQna', () => {
    it('should emit create', () => {
      component.emitCreate();
      expect(component.create.emit).toHaveBeenCalledTimes(1);
      expect(component.create.emit).toHaveBeenCalledWith({
        title: '',
        questionMarkdoc: null,
        answerMarkdoc: null,
        team: null,
      });

      component.qnaForm.controls.title.setValue('Question?');
      component.qnaForm.controls.team.setValue(testTeam1);
      component.emitCreate();
      expect(component.create.emit).toHaveBeenCalledTimes(2);
      expect(component.create.emit).toHaveBeenCalledWith({
        title: 'Question?',
        questionMarkdoc: null,
        answerMarkdoc: null,
        team: testTeam1.slug,
      });
    });
  });
});
