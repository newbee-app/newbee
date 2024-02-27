import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SolrOrgEntryEnum,
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '@newbee/shared/util';
import { capitalize } from 'lodash-es';
import { SearchResultTypeBtnComponent } from './search-result-type-btn.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultTypeBtnComponent', () => {
  let component: SearchResultTypeBtnComponent;
  let fixture: ComponentFixture<SearchResultTypeBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultTypeBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultTypeBtnComponent);
    component = fixture.componentInstance;

    component.searchResult = testOrgMemberSearchResult1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('searchResultType', () => {
    it('should return the search result type as a string', () => {
      expect(component.searchResultType).toEqual(
        capitalize(SolrOrgEntryEnum.User),
      );

      component.searchResult = testTeamSearchResult1;
      expect(component.searchResultType).toEqual(
        capitalize(SolrOrgEntryEnum.Team),
      );

      component.searchResult = testDocSearchResult1;
      expect(component.searchResultType).toEqual(
        capitalize(SolrOrgEntryEnum.Doc),
      );

      component.searchResult = testQnaSearchResult1;
      expect(component.searchResultType).toEqual(
        capitalize(SolrOrgEntryEnum.Qna),
      );
    });
  });
});
