import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgInviteDeclineComponent } from './org-invite-decline.component';

describe('OrgInviteDeclineComponent', () => {
  let component: OrgInviteDeclineComponent;
  let fixture: ComponentFixture<OrgInviteDeclineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgInviteDeclineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgInviteDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
