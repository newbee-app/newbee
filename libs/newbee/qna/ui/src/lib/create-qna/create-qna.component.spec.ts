import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateQnaComponent } from './create-qna.component';

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

  describe('createQna', () => {
    it('should emit create', () => {
      component.emitCreate();
      expect(component.create.emit).toBeCalledTimes(1);
      expect(component.create.emit).toBeCalledWith({
        title: '',
        questionMarkdoc: null,
        answerMarkdoc: null,
      });

      component.qnaTitle.controls.title.setValue('Question?');
      component.emitCreate();
      expect(component.create.emit).toBeCalledTimes(2);
      expect(component.create.emit).toBeCalledWith({
        title: 'Question?',
        questionMarkdoc: null,
        answerMarkdoc: null,
      });
    });
  });
});
