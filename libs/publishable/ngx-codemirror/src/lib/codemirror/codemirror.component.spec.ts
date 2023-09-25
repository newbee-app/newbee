import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodemirrorComponent } from './codemirror.component';

describe('CodemirrorComponent', () => {
  let component: CodemirrorComponent;
  let fixture: ComponentFixture<CodemirrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodemirrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodemirrorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('wrapper should match', () => {
    const wrapperDiv: HTMLDivElement | null =
      fixture.nativeElement.querySelector('div');
    expect(wrapperDiv).toEqual(component.wrapper.nativeElement);
  });
});
