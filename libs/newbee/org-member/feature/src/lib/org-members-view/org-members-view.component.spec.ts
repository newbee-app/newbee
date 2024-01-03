import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ViewOrgMembersComponent } from '@newbee/newbee/org-member/ui';
import { initialOrganizationState as initialOrganizationModuleState } from '@newbee/newbee/organization/data-access';
import {
  OrgMemberActions,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateOrgMemberInviteDto1,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgMembersViewComponent } from './org-members-view.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgMembersViewComponent', () => {
  let component: OrgMembersViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ViewOrgMembersComponent],
      declarations: [OrgMembersViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
            [`${Keyword.Organization}Module`]: initialOrganizationModuleState,
          },
        }),
        provideRouter([{ path: '**', component: OrgMembersViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}`,
      OrgMembersViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onInvite', () => {
    it('should dispatch inviteUser', () => {
      component.onInvite(testBaseCreateOrgMemberInviteDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrgMemberActions.inviteUser({
          createOrgMemberInviteDto: testBaseCreateOrgMemberInviteDto1,
        }),
      );
    });
  });

  describe('onOrgNavigate', () => {
    it('should navigate to path', async () => {
      await component.onOrgNavigate(
        `/${ShortUrl.Member}/${testOrgMember1.slug}`,
      );
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}`,
      );
    });
  });
});
