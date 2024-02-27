import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
  userDisplayName,
} from '@newbee/shared/util';
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

    component.searchResult = testOrgMemberSearchResult1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('searchResultAsPost', () => {
    it('should return a Post if applicable, null otherwise', () => {
      expect(component.searchResultAsPost).toBeNull();

      component.searchResult = testTeamSearchResult1;
      expect(component.searchResultAsPost).toBeNull();

      component.searchResult = testDocSearchResult1;
      expect(component.searchResultAsPost).toEqual(testDocSearchResult1.doc);

      component.searchResult = testQnaSearchResult1;
      expect(component.searchResultAsPost).toEqual(testQnaSearchResult1.qna);
    });
  });

  describe('searchResultHeader', () => {
    it('should return a header for the search result', () => {
      expect(component.searchResultHeader).toEqual(
        userDisplayName(testOrgMemberSearchResult1.user),
      );

      component.searchResult = testTeamSearchResult1;
      expect(component.searchResultHeader).toEqual(testTeamSearchResult1.name);

      component.searchResult = testDocSearchResult1;
      expect(component.searchResultHeader).toEqual(
        testDocSearchResult1.doc.title,
      );

      component.searchResult = testQnaSearchResult1;
      expect(component.searchResultHeader).toEqual(
        testQnaSearchResult1.qna.title,
      );
    });
  });

  describe('headerClick', () => {
    it('should navigate to the proper URL', () => {
      component.headerClick();
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Member}/${testOrgMemberSearchResult1.orgMember.slug}`,
      });

      component.searchResult = testTeamSearchResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Team}/${testTeamSearchResult1.slug}`,
      });

      component.searchResult = testDocSearchResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Doc}/${testDocSearchResult1.doc.slug}`,
      });

      component.searchResult = testQnaSearchResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Qna}/${testQnaSearchResult1.qna.slug}`,
      });
    });
  });
});
