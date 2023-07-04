import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgInviteAcceptComponent } from './org-invite-accept.component';

describe('OrgInviteAcceptComponent', () => {
  let component: OrgInviteAcceptComponent;
  let fixture: ComponentFixture<OrgInviteAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgInviteAcceptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgInviteAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
