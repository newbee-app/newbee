import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SolrEntryEnum,
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
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

    component.searchResult = testOrgMemberQueryResult1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('searchResultType', () => {
    it('should return the search result type as a string', () => {
      expect(component.searchResultType).toEqual(
        capitalize(SolrEntryEnum.User),
      );

      component.searchResult = testTeamQueryResult1;
      expect(component.searchResultType).toEqual(
        capitalize(SolrEntryEnum.Team),
      );

      component.searchResult = testDocQueryResult1;
      expect(component.searchResultType).toEqual(capitalize(SolrEntryEnum.Doc));

      component.searchResult = testQnaQueryResult1;
      expect(component.searchResultType).toEqual(capitalize(SolrEntryEnum.Qna));
    });
  });
});
