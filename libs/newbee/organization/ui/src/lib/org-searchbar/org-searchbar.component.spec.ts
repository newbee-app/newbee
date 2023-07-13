import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
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
      expect(component.searchTerm.value).toEqual('');
    });

    it('should emit suggest when the searchbar changes', () => {
      component.searchTerm.setValue('hello');
      expect(component.searchbar.emit).toBeCalledTimes(1);
      expect(component.searchbar.emit).toBeCalledWith('hello');
    });
  });

  describe('emitSearch', () => {
    let submitEvent: SubmitEvent;

    beforeEach(() => {
      submitEvent = createMock<SubmitEvent>();
    });

    afterEach(() => {
      expect(submitEvent.preventDefault).toBeCalledTimes(1);
    });

    it('should preventDefault but not emit', () => {
      component.emitSearch(submitEvent);
      expect(component.search.emit).toBeCalledTimes(0);
    });

    it('should preventDefault and emit', () => {
      component.searchTerm.setValue('search');
      component.emitSearch(submitEvent);
      expect(component.search.emit).toBeCalledTimes(1);
      expect(component.search.emit).toBeCalledWith(component.searchTerm.value);
    });
  });
});
