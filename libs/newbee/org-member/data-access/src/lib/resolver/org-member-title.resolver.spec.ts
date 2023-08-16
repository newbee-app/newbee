import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialHttpState,
  initialOrgMemberState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  forbiddenError,
  Keyword,
  testOrgMember1,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { orgMemberTitleResolver } from './org-member-title.resolver';

describe('orgMemberTitleResolver', () => {
  let router: Router;
  let store: MockStore;
  let location: Location;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            title: 'Error',
            children: [
              {
                path: `:${ShortUrl.Member}`,
                component: EmptyComponent,
                title: orgMemberTitleResolver,
              },
            ],
          },
          {
            path: '',
            title: 'NewBee',
            children: [
              {
                path: `:${ShortUrl.Member}`,
                component: EmptyComponent,
                title: orgMemberTitleResolver,
              },
              {
                path: '',
                component: EmptyComponent,
              },
            ],
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

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    title = TestBed.inject(Title);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it('should use parent tile if error detected', async () => {
    await expect(
      router.navigate([`/test/${testOrgMember1.slug}`])
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/test/${testOrgMember1.slug}`);
    expect(title.getTitle()).toEqual('Error');
  });

  it(`should title to org member's name prepended to existing title if store has selected org member`, async () => {
    await expect(
      router.navigate([`/${testOrgMember1.slug}`])
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testOrgMember1.slug}`);
    expect(title.getTitle()).toEqual(`${testUser1.displayName} - NewBee`);
  });

  it(`should set title to Error prepended to existing title if store has error instead of selected org member`, async () => {
    store.setState({
      [Keyword.Http]: {
        ...initialHttpState,
        screenError: { status: 403, message: forbiddenError },
      },
    });
    await expect(
      router.navigate([`/${testOrgMember1.slug}`])
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testOrgMember1.slug}`);
    expect(title.getTitle()).toEqual('Error - NewBee');
  });
});
