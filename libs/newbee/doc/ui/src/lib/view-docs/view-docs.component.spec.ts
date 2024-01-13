import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testPaginatedResultsDocQueryResult1 } from '@newbee/shared/util';
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

    component.docs = testPaginatedResultsDocQueryResult1;

    jest.spyOn(component.search, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should update docs to show', () => {
      expect(component.docsToShow).toEqual(
        testPaginatedResultsDocQueryResult1.results,
      );
    });
  });

  describe('constructor', () => {
    it('should update docs to show', () => {
      component.searchForm.setValue({ searchbar: 'searchbar' });
      expect(component.docsToShow.length).toEqual(0);
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
});
