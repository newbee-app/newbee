import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  testDocQueryResult1,
  testOrgMemberUser1,
  testQnaQueryResult1,
} from '@newbee/shared/util';
import { PostSearchResultHeaderComponent } from './post-search-result-header.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('PostSearchResultHeaderComponent', () => {
  let component: PostSearchResultHeaderComponent;
  let fixture: ComponentFixture<PostSearchResultHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSearchResultHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostSearchResultHeaderComponent);
    component = fixture.componentInstance;

    component.searchResult = testDocQueryResult1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('maintainerIsCreator', () => {
    it('should return false if either is null', () => {
      component.searchResult = {
        ...testDocQueryResult1,
        creator: null,
        maintainer: null,
      };
      expect(component.maintainerIsCreator).toBeFalsy();

      component.searchResult = {
        ...testDocQueryResult1,
        creator: testOrgMemberUser1,
        maintainer: null,
      };
      expect(component.maintainerIsCreator).toBeFalsy();

      component.searchResult = {
        ...testDocQueryResult1,
        creator: null,
        maintainer: testOrgMemberUser1,
      };
      expect(component.maintainerIsCreator).toBeFalsy();
    });

    it('should return true if both are defined and match', () => {
      expect(component.maintainerIsCreator).toBeTruthy();
    });
  });

  describe('postNavigate', () => {
    it('should navigate to the given post', () => {
      component.postNavigate();
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(1);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith(
        `/${ShortUrl.Doc}/${testDocQueryResult1.doc.slug}`,
      );

      component.searchResult = testQnaQueryResult1;
      component.postNavigate();
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(2);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith(
        `/${ShortUrl.Qna}/${testQnaQueryResult1.qna.slug}`,
      );
    });
  });
});
