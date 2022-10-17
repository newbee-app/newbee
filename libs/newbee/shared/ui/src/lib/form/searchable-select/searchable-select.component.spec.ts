import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { createMock } from '@golevelup/ts-jest';
import {
  ClickService,
  testSelectOption1,
  testSelectOption2,
} from '@newbee/newbee/shared/util';
import { Subject } from 'rxjs';
import { SearchableSelectComponent } from './searchable-select.component';

const testOptions = [testSelectOption1, testSelectOption2];

describe('SearchableSelectComponent', () => {
  let component: SearchableSelectComponent;
  let fixture: ComponentFixture<SearchableSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        {
          provide: ClickService,
          useValue: createMock<ClickService>({
            documentClickTarget: createMock<Subject<HTMLElement>>({
              subscribe: jest.fn(),
              unsubscribe: jest.fn(),
            }),
          }),
        },
      ],
      declarations: [SearchableSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableSelectComponent);
    component = fixture.componentInstance;

    component.options = testOptions;
    component.optionName = 'Country';

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should initialize with expected values', () => {
      expect(component.defaultOption).toBeUndefined();
      expect(component.expand).toBeFalsy();
      expect(component.selectedOption).toBeNull();
      expect(component.searchbox).toBeDefined();
      expect(
        component.clickService.documentClickTarget.subscribe
      ).toBeCalledTimes(1);
      expect(component.selectedText).toEqual(`Select ${component.optionName}`);
      expect(component.optionsWithSearch).toEqual(component.options);
    });

    it('should call selectOption if defaultOption is specified', () => {
      jest.spyOn(component, 'selectOption');
      component.defaultOption = testSelectOption1;
      component.ngOnInit();
      expect(component.selectOption).toBeCalledTimes(1);
      expect(component.selectOption).toBeCalledWith(testSelectOption1);
    });
  });

  describe('destroy', () => {
    it('should unsubscribe from infinite observables', () => {
      component.ngOnDestroy();
      expect(
        component.clickService.documentClickTarget.unsubscribe
      ).toBeCalledTimes(1);
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
      expect(component.expand).toBeTruthy();
      expect(optionsElement()).not.toBeNull();
    });

    it('should be called when dropdown button is clicked', () => {
      jest.spyOn(component, 'toggleExpand');
      const dropdownButtonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector('#dropdown-button');
      dropdownButtonElement.click();
      expect(component.toggleExpand).toBeCalledTimes(1);
    });
  });

  describe('selectedText', () => {
    it('should ouput the selected value', () => {
      component.selectedOption = testSelectOption1;
      expect(component.selectedText).toEqual(testSelectOption1.selectedValue);
    });

    it('should be displayed in #selected-text', () => {
      const selectedTextElement: HTMLSpanElement =
        fixture.nativeElement.querySelector('#selected-text');
      expect(selectedTextElement.innerHTML).toEqual(component.selectedText);
    });
  });

  describe('optionsWithSearch', () => {
    let koreaOptionElement: () => HTMLButtonElement | null;

    beforeEach(() => {
      koreaOptionElement = () =>
        fixture.nativeElement.querySelector('#KR-option');
      component.toggleExpand();
      fixture.detectChanges();
    });

    it('should output options restricted by searchbox', () => {
      expect(koreaOptionElement()).not.toBeNull();
      component.searchbox.setValue('united');
      fixture.detectChanges();
      expect(component.optionsWithSearch).toEqual([testSelectOption1]);
      expect(koreaOptionElement()).toBeNull();
    });
  });

  describe('selectOption', () => {
    beforeEach(() => {
      jest.spyOn(component.selected, 'emit');
    });

    it('should work with SelectOption', () => {
      component.expand = true;
      component.selectOption(testSelectOption1);
      expect(component.selectedOption).toEqual(testSelectOption1);
      expect(component.selected.emit).toBeCalledTimes(1);
      expect(component.selected.emit).toBeCalledWith(testSelectOption1.value);
      expect(component.expand).toBeFalsy();
    });

    it('should work with string', () => {
      component.expand = true;
      component.selectOption(testSelectOption2.value);
      expect(component.selectedOption).toEqual(testSelectOption2);
      expect(component.selected.emit).toBeCalledTimes(1);
      expect(component.selected.emit).toBeCalledWith(testSelectOption2.value);
      expect(component.expand).toBeFalsy();
    });

    it('should do nothing if option does not exist', () => {
      component.selectOption('XX');
      expect(component.selectedOption).toBeNull();
      expect(component.selected.emit).not.toBeCalled();
    });
  });
});
