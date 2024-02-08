import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  initialOrganizationState,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { initialTeamState } from '@newbee/newbee/team/data-access';
import { CreateTeamComponent } from '@newbee/newbee/team/ui';
import {
  Keyword,
  testCreateTeamDto1,
  testOrganizationRelation1,
  testTeam1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamCreateComponent } from './team-create.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('TeamCreateComponent', () => {
  let component: TeamCreateComponent;
  let fixture: ComponentFixture<TeamCreateComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CreateTeamComponent],
      declarations: [TeamCreateComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [`${Keyword.Team}Module`]: initialTeamState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCreateComponent);
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

  describe('onName', () => {
    it('should dispatch generateSlug', fakeAsync(() => {
      component.onName(testTeam1.name);
      tick(600);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.generateSlug({ name: testTeam1.name }),
      );
    }));
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

  describe('onCreate', () => {
    it('should dispatch createTeam', () => {
      component.onCreate(testCreateTeamDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.createTeam({ createTeamDto: testCreateTeamDto1 }),
      );
    });
  });
});
