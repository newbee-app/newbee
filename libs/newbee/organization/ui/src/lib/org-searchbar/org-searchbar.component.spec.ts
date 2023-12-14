import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgSearchbarComponent } from './org-searchbar.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgSearchbarComponent', () => {
  let component: OrgSearchbarComponent;
  let fixture: ComponentFixture<OrgSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgSearchbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgSearchbarComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.search, 'emit');
    jest.spyOn(component.searchbar, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should have initialized properly', () => {
      expect(component.searchTerm.value).toEqual({ searchbar: '' });
    });

    it('should emit suggest when the searchbar changes', () => {
      component.searchTerm.setValue({ searchbar: 'hello' });
      expect(component.searchbar.emit).toHaveBeenCalledTimes(1);
      expect(component.searchbar.emit).toHaveBeenCalledWith('hello');
    });
  });

  describe('emitSearch', () => {
    it('should not emit when search term is empty', () => {
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(0);
    });

    it('should emit when search term is not empty', () => {
      component.searchTerm.setValue({ searchbar: 'search' });
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith(
        component.searchTerm.controls.searchbar.value,
      );
    });
  });
});
