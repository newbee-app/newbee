import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Country,
  testSelectOptionCountry1,
  testSelectOptionCountry2,
} from '@newbee/newbee/shared/util';
import { SearchableSelectComponent } from './searchable-select.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

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

  describe('setters', () => {
    it('should update options to show', () => {
      component.options = [testSelectOptionCountry1];
      expect(component.optionsWithSearch).toEqual([testSelectOptionCountry1]);
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
      expect(component.onTouched).toHaveBeenCalledTimes(1);
      expect(component.exited.emit).toHaveBeenCalledTimes(1);
    });

    it('should not call onTouched nor emit exited if emitEvent is false', () => {
      component.expand();
      component.shrink(false);
      expect(component.onTouched).not.toHaveBeenCalled();
      expect(component.exited.emit).not.toHaveBeenCalled();
    });
  });

  describe('selectedText', () => {
    it('should ouput the selected value', () => {
      component.writeValue(testSelectOptionCountry1.value);
      expect(component.selectedText).toEqual(
        testSelectOptionCountry1.selectedValue,
      );
    });

    it('should be displayed in the DOM', () => {
      const selectedTextElement: HTMLSpanElement =
        fixture.nativeElement.querySelector('span');
      expect(selectedTextElement.innerHTML).toEqual(component.selectedText);
    });
  });

  describe('optionsWithSearch', () => {
    it('should output options restricted by searchbox', () => {
      component.searchTerm.setValue('united');
      expect(component.optionsWithSearch).toEqual([testSelectOptionCountry1]);
    });
  });

  describe('writeValue', () => {
    it('should change selectedOption without calling onChange or onTouched', () => {
      component.expand();
      component.writeValue(testSelectOptionCountry2.value);
      expect(component.value).toEqual(testSelectOptionCountry2.value);
      expect(component.expanded).toBeFalsy();
      expect(component.onChange).not.toHaveBeenCalled();
      expect(component.onTouched).not.toHaveBeenCalled();
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
      expect(component.onChange).toHaveBeenCalledTimes(1);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
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
