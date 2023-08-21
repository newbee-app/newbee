import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { testDoc1, testPost1, testQna1 } from '@newbee/shared/util';
import { SearchResultHeaderComponent } from './search-result-header.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultHeaderComponent', () => {
  let component: SearchResultHeaderComponent;
  let fixture: ComponentFixture<SearchResultHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultHeaderComponent);
    component = fixture.componentInstance;

    component.post = testDoc1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('postNavigate', () => {
    it('should navigate to the given post', () => {
      component.postNavigate();
      expect(component.orgNavigate.emit).toBeCalledTimes(1);
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Doc}/${testDoc1.slug}`
      );

      component.post = testQna1;
      component.postNavigate();
      expect(component.orgNavigate.emit).toBeCalledTimes(2);
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Qna}/${testQna1.slug}`
      );

      component.post = testPost1;
      component.postNavigate();
      expect(component.orgNavigate.emit).toBeCalledTimes(2);
    });
  });
});
