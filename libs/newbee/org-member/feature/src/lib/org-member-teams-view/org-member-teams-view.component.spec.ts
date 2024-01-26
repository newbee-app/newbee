import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ViewOrgMemberTeamsComponent } from '@newbee/newbee/org-member/ui';
import { initialOrganizationState } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
  testTeam1,
} from '@newbee/shared/util';
import { provideMockStore } from '@ngrx/store/testing';
import { OrgMemberTeamsViewComponent } from './org-member-teams-view.component';

describe('OrgMemberTeamsViewComponent', () => {
  let component: OrgMemberTeamsViewComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrgMemberTeamsComponent],
      declarations: [OrgMemberTeamsViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: OrgMemberTeamsViewComponent }]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}/${ShortUrl.Team}`,
      OrgMemberTeamsViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the currently selected org', async () => {
      await component.onOrgNavigate({
        route: `/${ShortUrl.Team}/${testTeam1.slug}`,
      });
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}`,
      );
    });
  });
});
