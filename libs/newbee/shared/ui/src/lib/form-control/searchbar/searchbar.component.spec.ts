import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  const testSearchTerm = 'search';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should initialize the searchbar control value', () => {
      expect(component.placeholder).toBeTruthy();
      expect(component.includeSearchSymbol).toBeTruthy();
      expect(component.includeClearSymbol).toBeTruthy();
      expect(component.searchbar.value).toEqual('');
      expect(component.onChange).toBeDefined();
      expect(component.onTouched).toBeDefined();
    });
  });

  describe('writeValue', () => {
    it('should change the search value', () => {
      component.writeValue('searching');
      expect(component.searchbar.value).toEqual('searching');
    });
  });

  describe('setDisabledState', () => {
    it('should update searchbar form control', () => {
      component.setDisabledState(true);
      expect(component.searchbar.disabled).toBeTruthy();
      component.setDisabledState(false);
      expect(component.searchbar.disabled).toBeFalsy();
    });
  });

  describe('focusOnInput', () => {
    it('should focus on the input', () => {
      jest.spyOn(component.searchbarInput.nativeElement, 'focus');
      component.focusOnInput();
      expect(component.searchbarInput.nativeElement.focus).toBeCalledTimes(1);
    });
  });

  describe('clear', () => {
    it('should clear the searchbar', () => {
      component.searchbar.setValue(testSearchTerm);
      expect(component.searchbar.value).toEqual(testSearchTerm);
      component.clear();
      expect(component.searchbar.value).toEqual('');
    });
  });
});
