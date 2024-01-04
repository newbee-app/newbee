import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testTeam1,
  testTeam2,
  testTeamMemberRelation1,
  testTeamMemberRelation2,
} from '@newbee/shared/util';
import { ViewOrgMemberTeamsComponent } from './view-org-member-teams.component';

describe('ViewOrgMemberTeamsComponent', () => {
  let component: ViewOrgMemberTeamsComponent;
  let fixture: ComponentFixture<ViewOrgMemberTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrgMemberTeamsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOrgMemberTeamsComponent);
    component = fixture.componentInstance;

    component.teams = [
      testTeamMemberRelation1,
      { ...testTeamMemberRelation2, team: testTeam2 },
    ];

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('setters', () => {
    it('should update teams to show', () => {
      expect(component.teamsToShow).toEqual([
        testTeamMemberRelation1,
        { ...testTeamMemberRelation2, team: testTeam2 },
      ]);
    });
  });

  describe('constructor', () => {
    it('should filter teams to show by searchbar', () => {
      component.searchbar.setValue(testTeam1.name.toUpperCase());
      expect(component.teamsToShow).toEqual([testTeamMemberRelation1]);
    });
  });
});
