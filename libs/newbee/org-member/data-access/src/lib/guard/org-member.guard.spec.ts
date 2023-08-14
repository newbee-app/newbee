import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialOrgMemberState,
  OrgMemberActions,
  ShortUrl,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { orgMemberGuard } from './org-member.guard';

describe('orgMemberGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: `:${ShortUrl.Member}`,
            component: EmptyComponent,
            canActivate: [orgMemberGuard],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Member]: {
              ...initialOrgMemberState,
              selectedOrgMember: testOrgMemberRelation1,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch store and navigate', async () => {
    await expect(
      router.navigate([`/${testOrgMember1.slug}`])
    ).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      OrgMemberActions.getOrgMember({ slug: testOrgMember1.slug })
    );
    expect(location.path()).toEqual(`/${testOrgMember1.slug}`);
  });
});
