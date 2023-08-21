import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { testTeam1 } from '@newbee/shared/util';
import { TeamSearchResultComponent } from './team-search-result.component';

describe('TeamSearchResultComponent', () => {
  let component: TeamSearchResultComponent;
  let fixture: ComponentFixture<TeamSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSearchResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamSearchResultComponent);
    component = fixture.componentInstance;

    component.team = testTeam1;

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
      expect(component.orgNavigate.emit).toBeCalledTimes(1);
      expect(component.orgNavigate.emit).toBeCalledWith(
        `/${ShortUrl.Team}/${testTeam1.slug}`
      );
    });
  });
});
