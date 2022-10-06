import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';

const testContainerId = 'container';
const testTooltipId = 'tooltip';
const testMessageId = 'message';
const testTailId = 'tail';
const testMessage = 'Hello';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;
  let containerElement: () => HTMLElement | null;
  let tooltipElement: () => HTMLElement | null;
  let messageElement: () => HTMLElement | null;
  let tailElement: () => HTMLElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    component.containerId = testContainerId;
    component.tooltipId = testTooltipId;
    component.messageId = testMessageId;
    component.tailId = testTailId;
    component.message = testMessage;

    fixture.detectChanges();

    containerElement = () =>
      fixture.nativeElement.querySelector(`#${testContainerId}`);
    tooltipElement = () =>
      fixture.nativeElement.querySelector(`#${testTooltipId}`);
    messageElement = () =>
      fixture.nativeElement.querySelector(`#${testMessageId}`);
    tailElement = () => fixture.nativeElement.querySelector(`#${testTailId}`);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('display tooltip', () => {
    beforeEach(() => {
      component.displayTooltip = true;

      fixture.detectChanges();
    });
    describe('css ids', () => {
      it('should all exist', () => {
        expect(containerElement()).not.toBeNull();
        expect(tooltipElement()).not.toBeNull();
        expect(messageElement()).not.toBeNull();
        expect(tailElement()).not.toBeNull();
      });
    });

    describe('message', () => {
      it('should exist', () => {
        expect(messageElement()?.innerHTML).toEqual(testMessage);
      });
    });
  });

  describe(`don't display tooltip`, () => {
    beforeEach(() => {
      component.displayTooltip = false;

      fixture.detectChanges();
    });

    describe('css ids', () => {
      it('tooltip should not exist', () => {
        expect(containerElement()).not.toBeNull();
        expect(tooltipElement()).toBeNull();
        expect(messageElement()).toBeNull();
        expect(tailElement()).toBeNull();
      });
    });
  });
});
