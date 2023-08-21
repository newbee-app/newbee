import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { testOrgMember1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { MemberSearchResultComponent } from './member-search-result.component';

describe('MemberSearchResultComponent', () => {
  let component: MemberSearchResultComponent;
  let fixture: ComponentFixture<MemberSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSearchResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSearchResultComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMemberRelation1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('orgMemberNavigate', () => {
    it('should navigate to the given org member', () => {
      component.orgMemberNavigate();
      expect(component.orgNavigate.emit).toBeCalledTimes(1);
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Member}/${testOrgMember1.slug}`
      );
    });
  });
});
