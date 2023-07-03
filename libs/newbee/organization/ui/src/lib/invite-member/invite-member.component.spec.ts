import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgRoleEnum, testUser1 } from '@newbee/shared/util';
import { InviteMemberComponent } from './invite-member.component';

describe('InviteMemberComponent', () => {
  let component: InviteMemberComponent;
  let fixture: ComponentFixture<InviteMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteMemberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMemberComponent);
    component = fixture.componentInstance;

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
      expect(component.invite.emit).toBeCalledTimes(1);
      expect(component.invite.emit).toBeCalledWith({
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
