import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { InviteMemberComponent } from '@newbee/newbee/organization/ui';
import { testInviteMemberForm1 } from '@newbee/newbee/organization/util';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { ErrorScreenComponent } from '@newbee/newbee/shared/feature';
import { testBaseCreateOrgMemberInviteDto1 } from '@newbee/shared/data-access';
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
      imports: [
        CommonModule,
        NavbarComponent,
        ErrorScreenComponent,
        InviteMemberComponent,
      ],
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
      component.onInvite(testInviteMemberForm1);
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        })
      );
    });
  });
});
