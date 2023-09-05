import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
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

    component.searchResult = testOrgMemberQueryResult1;

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
        testOrgMemberQueryResult1
      );
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testTeamQueryResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toEqual(testTeamQueryResult1);
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testDocQueryResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toEqual(testDocQueryResult1);
      expect(component.searchResultAsQna).toBeNull();

      component.searchResult = testQnaQueryResult1;
      expect(component.searchResultAsOrgMember).toBeNull();
      expect(component.searchResultAsTeam).toBeNull();
      expect(component.searchResultAsDoc).toBeNull();
      expect(component.searchResultAsQna).toEqual(testQnaQueryResult1);
    });
  });
});
