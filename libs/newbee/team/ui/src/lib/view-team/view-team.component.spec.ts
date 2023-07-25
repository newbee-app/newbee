import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testTeamRelation1 } from '@newbee/shared/util';
import { ViewTeamComponent } from './view-team.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('ViewTeamComponent', () => {
  let component: ViewTeamComponent;
  let fixture: ComponentFixture<ViewTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTeamComponent);
    component = fixture.componentInstance;

    component.team = testTeamRelation1;

    jest.spyOn(component.orgNavigate, 'emit');
    jest.spyOn(component.teamNavigate, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('getters', () => {
    it('should output correctly based on totals', () => {
      expect(component.totalMembers).toEqual('1 member');
      expect(component.totalQnas).toEqual('1 QnA');
      expect(component.totalDocs).toEqual('1 doc');

      component.team.teamMembers.total = 100;
      component.team.qnas.total = 100;
      component.team.docs.total = 100;
      expect(component.totalMembers).toEqual('100 members');
      expect(component.totalQnas).toEqual('100 QnAs');
      expect(component.totalDocs).toEqual('100 docs');
    });
  });
});
