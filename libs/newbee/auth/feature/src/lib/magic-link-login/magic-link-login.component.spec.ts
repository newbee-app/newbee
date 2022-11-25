import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MagicLinkLoginComponent } from './magic-link-login.component';

describe('MagicLinkLoginComponent', () => {
  let component: MagicLinkLoginComponent;
  let fixture: ComponentFixture<MagicLinkLoginComponent>;
  let store: MockStore;
  let route: ActivatedRouteSnapshot;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MagicLinkLoginComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRouteSnapshot,
          useValue: createMock<ActivatedRouteSnapshot>({
            queryParamMap: createMock<ParamMap>({
              get: jest.fn().mockReturnValue('1234'),
            }),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MagicLinkLoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRouteSnapshot);

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('selectQueryParams', () => {
    it('should dispatch confirmMagicLink', (done) => {
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

      expect(route.queryParamMap.get).toBeCalledTimes(1);
      expect(route.queryParamMap.get).toBeCalledWith('token');
    });
  });
});
