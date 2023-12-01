import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TeamRootComponent } from './team-root.component';

describe('TeamRootComponent', () => {
  let component: TeamRootComponent;
  let fixture: ComponentFixture<TeamRootComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [TeamRootComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamRootComponent);
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

  describe('ngOnDestroy', () => {
    it('should dispatch resetSelectedTeam', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(
        TeamActions.resetSelectedTeam(),
      );
    });
  });
});
