import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { ViewTeamComponent } from '@newbee/newbee/team/ui';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamViewComponent } from './team-view.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('TeamViewComponent', () => {
  let component: TeamViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamComponent],
      declarations: [TeamViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
            [Keyword.Team]: {
              ...initialTeamState,
              selectedTeam: testTeamRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: TeamViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}`,
      TeamViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('path');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/path`,
      );
    });
  });

  describe('onTeamNavigate', () => {
    it('should navigate relative to team', async () => {
      await component.onTeamNavigate('path');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}/path`,
      );
    });
  });
});
