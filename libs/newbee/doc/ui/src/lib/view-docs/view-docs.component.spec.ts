import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testDocQueryResult1, testQueryResults1 } from '@newbee/shared/util';
import { ViewDocsComponent } from './view-docs.component';

describe('ViewDocsComponent', () => {
  let component: ViewDocsComponent;
  let fixture: ComponentFixture<ViewDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocsComponent);
    component = fixture.componentInstance;

    component.docs = { ...testQueryResults1, results: [testDocQueryResult1] };

    jest.spyOn(component.search, 'emit');
    jest.spyOn(component.searchbar, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it(`should set the searchbar's value`, () => {
      component.searchParam = 'search param';
      expect(component.searchForm.value).toEqual({ searchbar: 'search param' });
    });
  });

  describe('constructor', () => {
    it('should emit searchbar', () => {
      component.searchForm.setValue({ searchbar: 'searchbar' });
      expect(component.searchbar.emit).toHaveBeenCalledTimes(1);
      expect(component.searchbar.emit).toHaveBeenCalledWith('searchbar');
    });
  });

  describe('emitSearch', () => {
    it('should emit search', () => {
      component.emitSearch();
      expect(component.search.emit).not.toHaveBeenCalled();

      component.searchForm.setValue({ searchbar: 'searching' });
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('searching');
    });
  });

  describe('selectSuggestion', () => {
    it('should set searchbar and emit search', () => {
      component.selectSuggestion('suggestion');
      expect(component.searchForm.value).toEqual({ searchbar: 'suggestion' });
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('suggestion');
    });
  });
});
