import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  AuthActions,
  selectQueryParams,
} from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MagicLinkLoginComponent } from './magic-link-login.component';

describe('MagicLinkLoginComponent', () => {
  let component: MagicLinkLoginComponent;
  let fixture: ComponentFixture<MagicLinkLoginComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MagicLinkLoginComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MagicLinkLoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('selectQueryParams', () => {
    it('should navigate if query params does not have a token property', () => {
      store.overrideSelector(selectQueryParams, {});
      store.refreshState();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['../']);
    });

    it('should dispatch confirmMagicLink if query params has a token property', (done) => {
      store.overrideSelector(selectQueryParams, { token: '1234' });
      store.refreshState();
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              AuthActions.confirmMagicLink({ token: '1234' })
            );
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });
});
