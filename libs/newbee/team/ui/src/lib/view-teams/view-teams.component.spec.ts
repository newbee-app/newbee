import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMember1,
  testTeam1,
  testTeam2,
} from '@newbee/shared/util';
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
      component.searchbar.setValue(testTeam1.name.toLowerCase());
      expect(component.teamsToShow).toEqual([testTeam1]);
    });
  });

  describe('emitOrgNavigate', () => {
    it('should emit joined paths', () => {
      component.emitOrgNavigate(ShortUrl.Team, Keyword.New);
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(1);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith(
        `/${ShortUrl.Team}/${Keyword.New}`,
      );
    });
  });
});
