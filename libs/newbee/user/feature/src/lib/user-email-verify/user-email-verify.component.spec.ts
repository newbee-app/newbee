import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UserActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserEmailVerifyComponent } from './user-email-verify.component';

describe('UserEmailVerifyComponent', () => {
  let component: UserEmailVerifyComponent;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEmailVerifyComponent],
      providers: [
        provideMockStore(),
        provideRouter([
          { path: `:${Keyword.Verify}`, component: UserEmailVerifyComponent },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/1234', UserEmailVerifyComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('constructor', () => {
    it('should dispatch ', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        UserActions.verifyEmail({ token: '1234' }),
      );
    });
  });
});
