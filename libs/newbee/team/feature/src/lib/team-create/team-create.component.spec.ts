import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import { CreateTeamComponent } from '@newbee/newbee/team/ui';
import { testCreateTeamForm1 } from '@newbee/newbee/team/util';
import { testBaseCreateTeamDto1 } from '@newbee/shared/data-access';
import { testTeam1 } from '@newbee/shared/util';
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
      imports: [CommonModule, NavbarComponent, CreateTeamComponent],
      declarations: [TeamCreateComponent],
      providers: [provideMockStore()],
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
      expect(store.dispatch).toBeCalledWith(
        TeamActions.generateSlug({ name: testTeam1.name })
      );
    }));
  });

  describe('onSlug', () => {
    it('should dispatch typingSlug', () => {
      component.onSlug(testTeam1.slug);
      expect(store.dispatch).toBeCalledWith(
        TeamActions.typingSlug({ slug: testTeam1.slug })
      );
    });
  });

  describe('onFormattedSlug', () => {
    it('should dispatch checkSlug', () => {
      component.onFormattedSlug(testTeam1.slug);
      expect(store.dispatch).toBeCalledWith(
        TeamActions.checkSlug({ slug: testTeam1.slug })
      );
    });
  });

  describe('onCreate', () => {
    it('should dispatch createTeam', () => {
      component.onCreate(testCreateTeamForm1);
      expect(store.dispatch).toBeCalledWith(
        TeamActions.createTeam({ createTeamDto: testBaseCreateTeamDto1 })
      );
    });
  });
});
