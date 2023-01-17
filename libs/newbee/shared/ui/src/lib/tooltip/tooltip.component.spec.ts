import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  const testMessage = 'Hello';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;

    component.message = testMessage;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('displayTooltip', () => {
    let messageElement: () => HTMLDivElement | null;

    beforeEach(() => {
      messageElement = () =>
        fixture.nativeElement.querySelector('div.absolute.flex');
    });

    it('should display tooltip if displayTooltip is true', () => {
      component.displayTooltip = true;
      fixture.detectChanges();

      expect(messageElement()).not.toBeNull();

      const messageDiv: HTMLDivElement | null =
        fixture.nativeElement.querySelector('div.relative.inset-x-0');
      expect(messageDiv?.innerHTML).toEqual(testMessage);
    });

    it('should not display tooltip is displayTooltip is false', () => {
      expect(messageElement()).toBeNull();
    });
  });
});
