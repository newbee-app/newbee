import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testOrgMember1, testTeam1, testTeam2 } from '@newbee/shared/util';
import { ViewTeamsComponent } from './view-teams.component';

describe('ViewTeamsComponent', () => {
  let component: ViewTeamsComponent;
  let fixture: ComponentFixture<ViewTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTeamsComponent);
    component = fixture.componentInstance;

    component.teams = [testTeam1, testTeam2];
    component.orgMember = testOrgMember1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should update teams to show', () => {
      expect(component.teamsToShow).toEqual([testTeam1, testTeam2]);
    });
  });

  describe('constructor', () => {
    it('should filter teams to show by searchbar', () => {
      component.searchbar.setValue(testTeam1.name.toUpperCase());
      expect(component.teamsToShow).toEqual([testTeam1]);
    });
  });
});
