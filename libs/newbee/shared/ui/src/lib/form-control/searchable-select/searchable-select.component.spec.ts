import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { createMock } from '@golevelup/ts-jest';
import {
  ClickService,
  Country,
  testSelectOption1,
  testSelectOption2,
} from '@newbee/newbee/shared/util';
import { Subject } from 'rxjs';
import { SearchbarComponentModule } from '../../searchbar/searchbar.component';
import { SearchableSelectComponent } from './searchable-select.component';

const testOptions = [testSelectOption1, testSelectOption2];

describe('SearchableSelectComponent', () => {
  let component: SearchableSelectComponent<Country>;
  let fixture: ComponentFixture<SearchableSelectComponent<Country>>;
  let clickService: ClickService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, SearchbarComponentModule],
      providers: [
        {
          provide: ClickService,
          useValue: createMock<ClickService>({
            documentClickTarget: createMock<Subject<HTMLElement>>(),
          }),
        },
      ],
      declarations: [SearchableSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableSelectComponent<Country>);
    component = fixture.componentInstance;
    clickService = TestBed.inject(ClickService);

    component.options = testOptions;
    component.optionName = 'Country';
    component.registerOnChange(jest.fn());
    component.registerOnTouched(jest.fn());
    jest.spyOn(component.exited, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(clickService).toBeDefined();
  });

  describe('init', () => {
    it('should initialize with expected values', () => {
      expect(component.valid).toBeTruthy();
      expect(component.expanded).toBeFalsy();
      expect(component.value).toBeNull();
      expect(component.disabled).toBeFalsy();
      expect(component.onChange).toBeDefined();
      expect(component.onTouched).toBeDefined();
      expect(clickService.documentClickTarget.pipe).toBeCalledTimes(1);
      expect(component.selectedText).toEqual(`Select ${component.optionName}`);
      expect(component.optionsWithSearch).toEqual(component.options);
    });
  });

  describe('toggleExpand', () => {
    let optionsElement: () => HTMLDivElement | null;

    beforeEach(() => {
      optionsElement = () =>
        fixture.nativeElement.querySelector('#options-container');
    });

    it('should not be visible initially', () => {
      expect(optionsElement()).toBeNull();
    });

    it('should toggle expand and become visible', () => {
      component.toggleExpand();
      fixture.detectChanges();
      expect(component.expanded).toBeTruthy();
      expect(optionsElement()).not.toBeNull();
    });

    it('should be called when dropdown button is clicked', () => {
      jest.spyOn(component, 'toggleExpand');
      const dropdownButtonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector('#dropdown-button');
      dropdownButtonElement.click();
      expect(component.toggleExpand).toBeCalledTimes(1);
    });

    it('should call onTouched and emit exited if closing an expanded toggle', () => {
      component.toggleExpand();
      component.toggleExpand();
      expect(component.onTouched).toBeCalledTimes(1);
      expect(component.exited.emit).toBeCalledTimes(1);
    });
  });

  describe('expand', () => {
    it('should set expanded to true', () => {
      component.expand();
      expect(component.expanded).toBeTruthy();
    });
  });

  describe('shrink', () => {
    it('should set expanded to false, call onTouched, and emit exited', () => {
      component.expand();
      component.shrink();
      expect(component.expanded).toBeFalsy();
      expect(component.onTouched).toBeCalledTimes(1);
      expect(component.exited.emit).toBeCalledTimes(1);
    });

    it('should not call onTouched nor emit exited if emitEvent is false', () => {
      component.expand();
      component.shrink(false);
      expect(component.onTouched).not.toBeCalled();
      expect(component.exited.emit).not.toBeCalled();
    });
  });

  describe('selectedText', () => {
    it('should ouput the selected value', () => {
      component.writeValue(testSelectOption1.value);
      expect(component.selectedText).toEqual(testSelectOption1.selectedValue);
    });

    it('should be displayed in #selected-text', () => {
      const selectedTextElement: HTMLSpanElement =
        fixture.nativeElement.querySelector('#selected-text');
      expect(selectedTextElement.innerHTML).toEqual(component.selectedText);
    });
  });

  describe('optionsWithSearch', () => {
    let option1Element: () => HTMLButtonElement | null;

    beforeEach(() => {
      option1Element = () => fixture.nativeElement.querySelector('#option-1');
      component.toggleExpand();
      fixture.detectChanges();
    });

    it('should output options restricted by searchbox', () => {
      expect(option1Element()).not.toBeNull();
      component.searchTerm = 'united';
      fixture.detectChanges();
      expect(component.optionsWithSearch).toEqual([testSelectOption1]);
      expect(option1Element()).toBeNull();
    });
  });

  describe('writeValue', () => {
    it('should change selectedOption without calling onChange or onTouched', () => {
      component.expand();
      component.writeValue(testSelectOption2.value);
      expect(component.value).toEqual(testSelectOption2.value);
      expect(component.expanded).toBeFalsy();
      expect(component.onChange).not.toBeCalled();
      expect(component.onTouched).not.toBeCalled();
    });

    it('should do nothing if option does not exist', () => {
      component.writeValue({
        regionCode: 'XX',
        name: 'Unknown',
        dialingCode: '0',
      });
      expect(component.value).toBeNull();
    });
  });

  describe('selectOption', () => {
    it('should change selectedOption while calling onChange and onTouched', () => {
      component.expand();
      component.selectOption(testSelectOption2.value);
      expect(component.value).toEqual(testSelectOption2.value);
      expect(component.expanded).toBeFalsy();
      expect(component.onChange).toBeCalledTimes(1);
      expect(component.onTouched).toBeCalledTimes(1);
    });

    it('should do nothing if option does not exist', () => {
      component.selectOption({
        regionCode: 'XX',
        name: 'Unknown',
        dialingCode: '0',
      });
      expect(component.value).toBeNull();
    });
  });
});
