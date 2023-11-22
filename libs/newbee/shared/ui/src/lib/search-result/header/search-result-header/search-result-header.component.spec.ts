import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
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

    component.searchResult = testOrgMemberQueryResult1;

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

      component.searchResult = testTeamQueryResult1;
      expect(component.searchResultAsPost).toBeNull();

      component.searchResult = testDocQueryResult1;
      expect(component.searchResultAsPost).toEqual(testDocQueryResult1.doc);

      component.searchResult = testQnaQueryResult1;
      expect(component.searchResultAsPost).toEqual(testQnaQueryResult1.qna);
    });
  });

  describe('searchResultHeader', () => {
    it('should return a header for the search result', () => {
      expect(component.searchResultHeader).toEqual(
        userDisplayName(testOrgMemberQueryResult1.user),
      );

      component.searchResult = testTeamQueryResult1;
      expect(component.searchResultHeader).toEqual(testTeamQueryResult1.name);

      component.searchResult = testDocQueryResult1;
      expect(component.searchResultHeader).toEqual(
        testDocQueryResult1.doc.title,
      );

      component.searchResult = testQnaQueryResult1;
      expect(component.searchResultHeader).toEqual(
        testQnaQueryResult1.qna.title,
      );
    });
  });

  describe('headerClick', () => {
    it('should navigate to the proper URL', () => {
      component.headerClick();
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Member}/${testOrgMemberQueryResult1.orgMember.slug}`,
      );

      component.searchResult = testTeamQueryResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Team}/${testTeamQueryResult1.slug}`,
      );

      component.searchResult = testDocQueryResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Doc}/${testDocQueryResult1.doc.slug}`,
      );

      component.searchResult = testQnaQueryResult1;
      component.headerClick();
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Qna}/${testQnaQueryResult1.qna.slug}`,
      );
    });
  });
});
