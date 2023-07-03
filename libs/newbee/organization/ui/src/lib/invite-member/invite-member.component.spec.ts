import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgRoleEnum } from '@newbee/shared/util';
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
      expect(component.invite).toBeCalledTimes(1);
      expect(component.invite).toBeCalledWith({
        email: '',
        role: OrgRoleEnum.Member,
      });
    });
  });
});
