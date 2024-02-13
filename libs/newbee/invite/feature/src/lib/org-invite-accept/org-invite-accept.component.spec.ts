import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testTokenDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgInviteAcceptComponent } from './org-invite-accept.component';

describe('OrgInviteAcceptComponent', () => {
  let component: OrgInviteAcceptComponent;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgInviteAcceptComponent],
      providers: [
        provideMockStore(),
        provideRouter([
          {
            path: `:${Keyword.Invite}`,
            component: OrgInviteAcceptComponent,
          },
          {
            path: '**',
            component: EmptyComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${testTokenDto1.token}`,
      OrgInviteAcceptComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('constructor', () => {
    it('should dispatch acceptInvite', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        InviteActions.acceptInvite({ tokenDto: testTokenDto1 }),
      );
    });
  });
});
