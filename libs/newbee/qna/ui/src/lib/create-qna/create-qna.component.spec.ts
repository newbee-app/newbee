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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
