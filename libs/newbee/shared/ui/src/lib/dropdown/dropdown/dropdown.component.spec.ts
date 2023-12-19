import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.expandedChange, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('expand', () => {
    it('should set expanded to true and emit', () => {
      component.expand();
      expect(component.expanded).toBeTruthy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(1);
      expect(component.expandedChange.emit).toHaveBeenCalledWith(true);

      component.expand();
      expect(component.expanded).toBeTruthy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('shrink', () => {
    it('should set expanded to false and emit', () => {
      component.shrink();
      expect(component.expanded).toBeFalsy();
      expect(component.expandedChange.emit).not.toHaveBeenCalled();

      component.expanded = true;
      component.shrink();
      expect(component.expanded).toBeFalsy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(1);
      expect(component.expandedChange.emit).toHaveBeenCalledWith(false);

      component.shrink();
      expect(component.expanded).toBeFalsy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleExpand', () => {
    it('should call expand and shrink depending on current state', () => {
      component.toggleExpand();
      expect(component.expanded).toBeTruthy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(1);
      expect(component.expandedChange.emit).toHaveBeenCalledWith(true);

      component.toggleExpand();
      expect(component.expanded).toBeFalsy();
      expect(component.expandedChange.emit).toHaveBeenCalledTimes(2);
      expect(component.expandedChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('labelClick', () => {
    it('should call relevant expand function based on expandStrategy', () => {
      jest.spyOn(component, 'toggleExpand');
      jest.spyOn(component, 'expand');

      component.labelClick();
      expect(component.toggleExpand).toHaveBeenCalledTimes(1);

      component.expandStrategy = 'expand';
      expect(component.expand).toHaveBeenCalledTimes(1);
    });
  });
});
