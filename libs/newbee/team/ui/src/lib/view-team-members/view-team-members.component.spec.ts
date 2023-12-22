import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  testOrgMember1,
  testOrgMemberUser1,
  testOrgMemberUser2,
} from '@newbee/shared/util';
import { ViewTeamMembersComponent } from './view-team-members.component';

describe('ViewTeamMembers', () => {
  let component: ViewTeamMembersComponent;
  let fixture: ComponentFixture<ViewTeamMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTeamMembersComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMember1;
    component.orgMembers = [testOrgMemberUser1, testOrgMemberUser2];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });
});
