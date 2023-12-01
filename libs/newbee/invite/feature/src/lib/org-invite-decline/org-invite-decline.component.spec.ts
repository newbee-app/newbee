import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword, testBaseTokenDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgInviteDeclineComponent } from './org-invite-decline.component';

describe('OrgInviteDeclineComponent', () => {
  let component: OrgInviteDeclineComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgInviteDeclineComponent],
      providers: [
        provideMockStore(),
        provideRouter([
          {
            path: `:${Keyword.Invite}`,
            component: OrgInviteDeclineComponent,
          },
          {
            path: '**',
            component: EmptyComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${testBaseTokenDto1.token}`,
      OrgInviteDeclineComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('init', () => {
    it('should dispatch declineInvite', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        InviteActions.declineInvite({ tokenDto: testBaseTokenDto1 }),
      );
    });
  });
});
