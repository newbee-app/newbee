import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { testTeam1, testTeamQueryResult1 } from '@newbee/shared/util';
import { TeamSearchResultComponent } from './team-search-result.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('TeamSearchResultComponent', () => {
  let component: TeamSearchResultComponent;
  let fixture: ComponentFixture<TeamSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSearchResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamSearchResultComponent);
    component = fixture.componentInstance;

    component.team = testTeamQueryResult1;

    jest.spyOn(component.orgNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('teamNavigate', () => {
    it('should navigate to the given team', () => {
      component.teamNavigate();
      expect(component.orgNavigate.emit).toHaveBeenCalledTimes(1);
      expect(component.orgNavigate.emit).toHaveBeenCalledWith({
        route: `${ShortUrl.Team}/${testTeam1.slug}`,
      });
    });
  });
});
