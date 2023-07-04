import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
} from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MagicLinkLoginComponent } from './magic-link-login.component';

describe('MagicLinkLoginComponent', () => {
  let component: MagicLinkLoginComponent;
  let fixture: ComponentFixture<MagicLinkLoginComponent>;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MagicLinkLoginComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>({
            snapshot: createMock<ActivatedRouteSnapshot>({
              paramMap: createMock<ParamMap>({
                get: jest.fn().mockReturnValue('1234'),
              }),
            }),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MagicLinkLoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('selectQueryParams', () => {
    it('should dispatch confirmMagicLink', () => {
      expect(store.dispatch).toBeCalledWith(
        AuthActions.confirmMagicLink({ token: '1234' })
      );
      expect(route.snapshot.paramMap.get).toBeCalledTimes(1);
      expect(route.snapshot.paramMap.get).toBeCalledWith(magicLinkLogin);
    });
  });
});
