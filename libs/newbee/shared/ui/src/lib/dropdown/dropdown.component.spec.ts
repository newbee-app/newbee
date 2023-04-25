import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Country,
  testSelectOption1,
  testSelectOption2,
} from '@newbee/newbee/shared/util';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent<Country>;
  let fixture: ComponentFixture<DropdownComponent<Country>>;

  const testOptions = [testSelectOption1, testSelectOption2];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent<Country>);
    component = fixture.componentInstance;

    component.dropdownText = 'More';
    component.options = testOptions;

    fixture.detectChanges();

    jest.spyOn(component.selectOption, 'emit');
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('expanded', () => {
    it('should initialize properly', () => {
      expect(component.expanded).toBeFalsy();
    });

    it('should expand and shrink properly', () => {
      component.expand();
      expect(component.expanded).toBeTruthy();
      component.shrink();
      expect(component.expanded).toBeFalsy();
    });

    it('should toggle properly', () => {
      component.toggleExpand();
      expect(component.expanded).toBeTruthy();
      component.toggleExpand();
      expect(component.expanded).toBeFalsy();
    });

    it('should display dropdown when expanded and not display when not expanded', () => {
      const dropdownElement: () => HTMLDivElement | null = () =>
        fixture.nativeElement.querySelector('div.absolute.hidden');
      expect(dropdownElement()).not.toBeNull();

      component.expand();
      fixture.detectChanges();
      expect(dropdownElement()).toBeNull();
    });

    it('should toggle when clicked on', () => {
      const dropdownElement: HTMLDivElement =
        fixture.nativeElement.querySelector('div.flex.flex-row');

      dropdownElement.click();
      fixture.detectChanges();
      expect(component.expanded).toBeTruthy();

      dropdownElement.click();
      fixture.detectChanges();
      expect(component.expanded).toBeFalsy();
    });
  });

  describe('options', () => {
    it('should initialize properly', () => {
      expect(component.options).toEqual(testOptions);
    });
  });

  describe('select', () => {
    beforeEach(() => {
      component.expand();
      fixture.detectChanges();
    });

    it('should emit selectOption and shrink the dropdown', () => {
      component.select(testSelectOption1);
      expect(component.expanded).toBeFalsy();
      expect(component.selectOption.emit).toBeCalledTimes(1);
      expect(component.selectOption.emit).toBeCalledWith(
        testSelectOption1.value
      );
    });

    it('should fire select() when clicking on an option', () => {
      const optionElement: HTMLButtonElement =
        fixture.nativeElement.querySelector('button.bg-bg-primary-light');
      optionElement.click();
      expect(component.expanded).toBeFalsy();
      expect(component.selectOption.emit).toBeCalledTimes(1);
      expect(component.selectOption.emit).toBeCalledWith(
        testSelectOption1.value
      );
    });
  });
});
