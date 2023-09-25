import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdocEditorComponent } from './markdoc-editor.component';

describe('MarkdocEditorComponent', () => {
  let component: MarkdocEditorComponent;
  let fixture: ComponentFixture<MarkdocEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdocEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdocEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });
});
