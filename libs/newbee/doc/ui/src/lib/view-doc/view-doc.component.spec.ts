import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testDocRelation1 } from '@newbee/shared/util';
import { ViewDocComponent } from './view-doc.component';

describe('ViewDocComponent', () => {
  let component: ViewDocComponent;
  let fixture: ComponentFixture<ViewDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocComponent);
    component = fixture.componentInstance;

    component.doc = testDocRelation1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });
});
