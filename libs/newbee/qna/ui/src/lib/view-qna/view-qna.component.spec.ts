import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testNowDayjs1, testQna1, testQnaRelation1 } from '@newbee/shared/util';
import { ViewQnaComponent } from './view-qna.component';

describe('ViewQnaComponent', () => {
  let component: ViewQnaComponent;
  let fixture: ComponentFixture<ViewQnaComponent>;

  const testOldNow1 = testNowDayjs1.subtract(1, 'day').toDate();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewQnaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewQnaComponent);
    component = fixture.componentInstance;

    component.qna = testQnaRelation1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('upToDate', () => {
    it('should be up-to-date if outOfDateAt has not happened yet', () => {
      expect(component.upToDate).toBeTruthy();

      component.qna = {
        ...testQnaRelation1,
        qna: {
          ...testQna1,
          outOfDateAt: testOldNow1,
        },
      };
      expect(component.upToDate).toBeFalsy();
    });
  });

  describe('borderSuccess', () => {
    it('should be true if the border should be green', () => {
      expect(component.borderSuccess).toBeTruthy();

      component.qna = {
        ...testQnaRelation1,
        qna: { ...testQna1, outOfDateAt: testOldNow1 },
      };
      expect(component.borderSuccess).toBeFalsy();

      component.qna = {
        ...testQnaRelation1,
        qna: { ...testQna1, answerHtml: null },
      };
      expect(component.borderSuccess).toBeFalsy();
    });
  });
});
