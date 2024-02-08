import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  TeamActions,
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { initialTeamState as initialTeamModuleState } from '@newbee/newbee/team/data-access';
import { ViewTeamMembersComponent } from '@newbee/newbee/team/ui';
import {
  Keyword,
  testCreateTeamMemberDto1,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
  testTeam1,
  testTeamRelation1,
  testUpdateTeamMemberDto1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamMembersViewComponent } from './team-members-view.component';

describe('TeamMembersViewComponent', () => {
  let component: TeamMembersViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamMembersComponent],
      declarations: [TeamMembersViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              orgMember: testOrgMemberRelation1,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Team]: {
              ...initialTeamState,
              selectedTeam: testTeamRelation1,
            },
            [`${Keyword.Team}Module`]: initialTeamModuleState,
          },
        }),
        provideRouter([{ path: '**', component: TeamMembersViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${testTeam1.slug}/${ShortUrl.Member}`,
      TeamMembersViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onAddTeamMember', () => {
    it('should dispatch addTeamMember', () => {
      component.onAddTeamMember(testCreateTeamMemberDto1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.addTeamMember({
          createTeamMemberDto: testCreateTeamMemberDto1,
        }),
      );
    });
  });

  describe('onEditTeamMember', () => {
    it('should dispatch editTeamMember', () => {
      component.onEditTeamMember({
        orgMemberSlug: testOrgMember1.slug,
        updateTeamMemberDto: testUpdateTeamMemberDto1,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.editTeamMember({
          orgMemberSlug: testOrgMember1.slug,
          updateTeamMemberDto: testUpdateTeamMemberDto1,
        }),
      );
    });
  });

  describe('onDeleteTeamMember', () => {
    it('should dispatch deleteTeamMember', () => {
      component.onDeleteTeamMember(testOrgMember1.slug);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.deleteTeamMember({ orgMemberSlug: testOrgMember1.slug }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to route', async () => {
      await component.onOrgNavigate({ route: '/test' });
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/test`,
      );
    });
  });
});
