import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { ViewOrgMemberComponent } from '@newbee/newbee/org-member/ui';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  OrgRoleEnum,
  testOrgMemberRelation1,
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
  let fixture: ComponentFixture<OrgMemberViewComponent>;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

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
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgMemberViewComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to org', async () => {
      await component.onOrgNavigate('test');
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../../test'], {
        relativeTo: route,
      });
    });
  });

  describe('onMemberNavigate', () => {
    it('should navigate relative to org member', async () => {
      await component.onMemberNavigate('test');
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['./test'], { relativeTo: route });
    });
  });

  describe('onEditRole', () => {
    it('should dispatch editOrgMember with given role', () => {
      component.onEditRole(OrgRoleEnum.Member);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        OrgMemberActions.editOrgMember({
          updateOrgMemberDto: { role: OrgRoleEnum.Member },
        })
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
