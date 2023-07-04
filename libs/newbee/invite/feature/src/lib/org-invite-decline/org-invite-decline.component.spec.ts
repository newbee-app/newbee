import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
} from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { InviteActions } from '@newbee/newbee/shared/data-access';
import { testBaseTokenDto1, UrlEndpoint } from '@newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgInviteDeclineComponent } from './org-invite-decline.component';

describe('OrgInviteDeclineComponent', () => {
  let component: OrgInviteDeclineComponent;
  let fixture: ComponentFixture<OrgInviteDeclineComponent>;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgInviteDeclineComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>({
            snapshot: createMock<ActivatedRouteSnapshot>({
              paramMap: createMock<ParamMap>({
                get: jest.fn().mockReturnValue(testBaseTokenDto1.token),
              }),
            }),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgInviteDeclineComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('init', () => {
    it('should dispatch declineInvite', () => {
      expect(route.snapshot.paramMap.get).toBeCalledTimes(1);
      expect(route.snapshot.paramMap.get).toBeCalledWith(UrlEndpoint.Invite);
      expect(store.dispatch).toBeCalledWith(
        InviteActions.declineInvite({ tokenDto: testBaseTokenDto1 })
      );
    });
  });
});
