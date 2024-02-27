import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '@newbee/shared/util';
import { SearchResultComponent } from './search-result.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;

    component.searchResult = testOrgMemberSearchResult1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('getters', () => {
    it('should only be non-null if types match', () => {
      expect(component.searchResultAsOrgMember).toEqual(
        testOrgMemberSearchResult1,
      );
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testTeamSearchResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toEqual(testTeamSearchResult1);
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testDocSearchResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toEqual(testDocSearchResult1);
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testQnaSearchResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toEqual(testQnaSearchResult1);
    });
  });
});
