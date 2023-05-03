import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Country,
  testSelectOptionCountry1,
  testSelectOptionCountry2,
} from '@newbee/newbee/shared/util';
import { SearchableSelectComponent } from './searchable-select.component';

describe('SearchableSelectComponent', () => {
  let component: SearchableSelectComponent<Country>;
  let fixture: ComponentFixture<SearchableSelectComponent<Country>>;

  const testOptions = [testSelectOptionCountry1, testSelectOptionCountry2];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableSelectComponent<Country>);
    component = fixture.componentInstance;

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
  });

  describe('init', () => {
    it('should initialize with expected values', () => {
      expect(component.valid).toBeTruthy();
      expect(component.errorText).toEqual('');
      expect(component.expanded).toBeFalsy();
      expect(component.value).toBeNull();
      expect(component.disabled).toBeFalsy();
      expect(component.onChange).toBeDefined();
      expect(component.onTouched).toBeDefined();
      expect(component.selectedText).toEqual(`Select ${component.optionName}`);
      expect(component.optionsWithSearch).toEqual(component.options);
    });
  });

  describe('toggleExpand', () => {
    it('should toggle expand and become expanded', () => {
      component.toggleExpand();
      fixture.detectChanges();
      expect(component.expanded).toBeTruthy();
    });

    it('should be called when dropdown button is clicked', () => {
      jest.spyOn(component, 'toggleExpand');
      const dropdownButtonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector('button');
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
      component.writeValue(testSelectOptionCountry1.value);
      expect(component.selectedText).toEqual(
        testSelectOptionCountry1.selectedValue
      );
    });

    it('should be displayed in the DOM', () => {
      const selectedTextElement: HTMLSpanElement =
        fixture.nativeElement.querySelector('span');
      expect(selectedTextElement.innerHTML).toEqual(component.selectedText);
    });
  });

  describe('optionsWithSearch', () => {
    beforeEach(() => {
      component.toggleExpand();
      fixture.detectChanges();
    });

    it('should output options restricted by searchbox', () => {
      component.searchTerm.setValue('united');
      fixture.detectChanges();
      expect(component.optionsWithSearch).toEqual([testSelectOptionCountry1]);
    });
  });

  describe('writeValue', () => {
    it('should change selectedOption without calling onChange or onTouched', () => {
      component.expand();
      component.writeValue(testSelectOptionCountry2.value);
      expect(component.value).toEqual(testSelectOptionCountry2.value);
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
      component.selectOption(testSelectOptionCountry2.value);
      expect(component.value).toEqual(testSelectOptionCountry2.value);
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
