import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { resetSelectedOrgMemberGuard } from './reset-selected-org-member.guard';

describe('resetSelectedOrgMemberGuard', () => {
  let router: Router;
  let store: MockStore;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            component: EmptyComponent,
          },
          {
            path: '',
            component: EmptyComponent,
            canDeactivate: [resetSelectedOrgMemberGuard],
          },
        ]),
      ],
      providers: [provideMockStore()],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch resetSelectedTeam and then navigate', async () => {
    await expect(router.navigate(['/test'])).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      OrgMemberActions.resetSelectedOrgMember()
    );
    expect(location.path()).toEqual('/test');
  });
});