import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ViewOrgMemberComponent } from '@newbee/newbee/org-member/ui';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgMemberViewComponent } from './org-member-view.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgMemberViewComponent', () => {
  let component: OrgMemberViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrgMemberComponent],
      declarations: [OrgMemberViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Member]: {
              selectedOrgMember: testOrgMemberRelation1,
            },
            [Keyword.Organization]: {
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: OrgMemberViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}`,
      OrgMemberViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('test');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/test`,
      );
    });
  });

  describe('onMemberNavigate', () => {
    it('should navigate relative to org member', async () => {
      await component.onMemberNavigate('test');
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Member}/${testOrgMember1.slug}/test`,
      );
    });
  });

  describe('onEditRole', () => {
    it('should dispatch editOrgMember with given role', () => {
      component.onEditRole(OrgRoleEnum.Member);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        OrgMemberActions.editOrgMember({
          updateOrgMemberDto: { role: OrgRoleEnum.Member },
        }),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteOrgMember', () => {
      component.onDelete();
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(OrgMemberActions.deleteOrgMember());
    });
  });
});
