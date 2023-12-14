import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TeamActions,
  initialOrganizationState,
  initialTeamState,
} from '@newbee/newbee/shared/data-access';
import { initialTeamState as initialTeamModuleState } from '@newbee/newbee/team/data-access';
import { EditTeamComponent } from '@newbee/newbee/team/ui';
import {
  Keyword,
  testBaseUpdateTeamDto1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamEditComponent } from './team-edit.component';

describe('TeamEditComponent', () => {
  let component: TeamEditComponent;
  let fixture: ComponentFixture<TeamEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, EditTeamComponent],
      declarations: [TeamEditComponent],
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
            [`${Keyword.Team}Module`]: initialTeamModuleState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamEditComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onSlug', () => {
    it('should dispatch typingSlug', () => {
      component.onSlug(testTeam1.slug);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.typingSlug({ slug: testTeam1.slug }),
      );
    });
  });

  describe('onFormattedSlug', () => {
    it('should dispatch checkSlug', () => {
      component.onFormattedSlug(testTeam1.slug);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.checkSlug({ slug: testTeam1.slug }),
      );
    });
  });

  describe('onEdit', () => {
    it('should dispatch editTeam', () => {
      component.onEdit(testBaseUpdateTeamDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.editTeam({ updateTeamDto: testBaseUpdateTeamDto1 }),
      );
    });
  });

  describe('onEditSlug', () => {
    it('should dispatch editTeamSlug', () => {
      component.onEditSlug(testTeam1.slug);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.editTeamSlug({ updateTeamDto: { slug: testTeam1.slug } }),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteTeam', () => {
      component.onDelete();
      expect(store.dispatch).toHaveBeenCalledWith(TeamActions.deleteTeam());
    });
  });
});
