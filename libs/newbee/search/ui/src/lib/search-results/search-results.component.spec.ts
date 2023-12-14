import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;

    component.initialSearchTerm = 'searching';
    jest.spyOn(component.search, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('ngOnInit', () => {
    it(`should set the searchbar's value`, () => {
      component.initialSearchTerm = 'searching';
      expect(component.searchTerm.value).toEqual({ searchbar: 'searching' });
    });
  });

  describe('selectSuggestion', () => {
    it('should set the search term and emit search', () => {
      component.selectSuggestion('suggestion');
      expect(component.searchTerm.value).toEqual({ searchbar: 'suggestion' });
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('suggestion');
    });
  });

  describe('emitSearch', () => {
    it(`should emit the search term if it's not empty`, () => {
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('searching');

      component.searchTerm.setValue({ searchbar: '' });
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(1);
    });
  });
});
