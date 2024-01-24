import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgMemberPostTab } from '@newbee/newbee/shared/util';
import { testPaginatedResultsDocQueryResult1 } from '@newbee/shared/util';
import { ViewPostsComponent } from './view-posts.component';

describe('ViewPostsComponent', () => {
  let component: ViewPostsComponent;
  let fixture: ComponentFixture<ViewPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPostsComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPostsComponent);
    component = fixture.componentInstance;

    component.posts = testPaginatedResultsDocQueryResult1;

    jest.spyOn(component.orgMemberTabChange, 'emit');
    jest.spyOn(component.search, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should update posts to show', () => {
      expect(component.postsToShow).toEqual(
        testPaginatedResultsDocQueryResult1.results,
      );
    });
  });

  describe('constructor', () => {
    it('should update posts to show', () => {
      component.searchForm.setValue({ searchbar: 'searchbar' });
      expect(component.postsToShow.length).toEqual(0);
    });
  });

  describe('emitSearch', () => {
    it('should emit search', () => {
      component.emitSearch();
      expect(component.search.emit).not.toHaveBeenCalled();

      component.searchForm.setValue({ searchbar: 'searching' });
      component.emitSearch();
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('searching');
    });
  });

  describe('changeOrgMemberTab', () => {
    it('should change orgMemberTab and emit', () => {
      component.changeOrgMemberTab(OrgMemberPostTab.Maintained);
      expect(component.orgMemberTab).toEqual(OrgMemberPostTab.Maintained);
      expect(component.orgMemberTabChange.emit).toHaveBeenCalledTimes(1);
      expect(component.orgMemberTabChange.emit).toHaveBeenCalledWith(
        OrgMemberPostTab.Maintained,
      );
    });
  });
});
