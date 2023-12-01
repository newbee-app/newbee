import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MagicLinkLoginComponent } from './magic-link-login.component';

describe('MagicLinkLoginComponent', () => {
  let component: MagicLinkLoginComponent;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MagicLinkLoginComponent],
      providers: [
        provideMockStore(),
        provideRouter([
          {
            path: `:${Keyword.MagicLinkLogin}`,
            component: MagicLinkLoginComponent,
          },
        ]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/1234', MagicLinkLoginComponent);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should dispatch confirmMagicLink', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.confirmMagicLink({ token: '1234' }),
      );
    });
  });
});
