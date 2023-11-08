import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteMemberComponent } from '@newbee/newbee/organization/ui';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { testBaseCreateOrgMemberInviteDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgInviteComponent } from './org-invite.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgInviteComponent', () => {
  let component: OrgInviteComponent;
  let fixture: ComponentFixture<OrgInviteComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, InviteMemberComponent],
      declarations: [OrgInviteComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgInviteComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onInvite', () => {
    it('should dispatch inviteUser', () => {
      component.onInvite(testBaseCreateOrgMemberInviteDto1);
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      );
    });
  });
});
