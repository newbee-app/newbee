import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgRoleEnum, testOrgMember1, testUser1 } from '@newbee/shared/util';
import { InviteMemberComponent } from './invite-member.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('InviteMemberComponent', () => {
  let component: InviteMemberComponent;
  let fixture: ComponentFixture<InviteMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteMemberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMemberComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMember1;

    jest.spyOn(component.invite, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('emitInvite', () => {
    it('should emit invite', () => {
      component.emitInvite();
      expect(component.invite.emit).toHaveBeenCalledTimes(1);
      expect(component.invite.emit).toHaveBeenCalledWith({
        email: '',
        role: OrgRoleEnum.Member,
      });
    });
  });

  describe('changes', () => {
    it(`should update form's email`, () => {
      component.ngOnChanges({
        invitedUser: new SimpleChange('', testUser1.email, true),
      });
      expect(component.inviteMemberForm.value).toEqual({
        email: '',
        role: OrgRoleEnum.Member,
      });
      expect(component.inviteMemberForm.pristine).toBeTruthy();
      expect(component.inviteMemberForm.untouched).toBeTruthy();
    });
  });
});
