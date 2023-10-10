import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, Router, Scroll } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  let router: Router;

  const events = new Subject<Event>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideMockStore({ initialState: { [Keyword.Auth]: { user: null } } }),
        {
          provide: Router,
          useValue: createMock<Router>({
            events,
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should set includeCenter to true if route is past org home', () => {
      expect(component.includeCenter).toBeFalsy();

      events.next(
        new NavigationEnd(
          0,
          `/${ShortUrl.Organization}/${testOrganization1.slug}/past`,
          `/${ShortUrl.Organization}/${testOrganization1.slug}/past`,
        ),
      );
      expect(component.includeCenter).toBeFalsy();

      const validScroll = new Scroll(
        createMock<NavigationEnd>({
          url: `/${ShortUrl.Organization}/${testOrganization1.slug}/past`,
        }),
        null,
        null,
      );
      events.next(validScroll);
      expect(component.includeCenter).toBeFalsy();

      store.setState({
        [Keyword.Organization]: {
          selectedOrganization: testOrganizationRelation1,
        },
      });
      events.next(validScroll);
      expect(component.includeCenter).toBeTruthy();
    });
  });

  describe('selectOrganization', () => {
    it('should navigate to org', async () => {
      await component.selectOrganization(testOrganization1);
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith([
        `/${ShortUrl.Organization}/${testOrganization1.slug}`,
      ]);
    });
  });

  describe('navigateToLink', () => {
    it('should navigate', async () => {
      await component.navigateToLink('/');
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['/']);
    });
  });

  describe('logout', () => {
    it('should dispatch logout', () => {
      component.logout();
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(AuthActions.logout());
    });
  });
});
