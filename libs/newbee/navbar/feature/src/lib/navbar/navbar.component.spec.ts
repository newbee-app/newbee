import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { testOrganization1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
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

  describe('selectOrganization', () => {
    it('should navigate to org if org is not equal to selectedOrganization', async () => {
      await component.selectOrganization(testOrganization1);
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith([`/${testOrganization1.slug}`]);
    });

    it('should not dispatch getOrg if organization is equal to selectedOrganization', () => {
      component.selectedOrganization = testOrgMemberRelation1;
      component.selectOrganization(testOrganization1);
      expect(router.navigate).not.toBeCalled();
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
    it('should dispatch logout', (done) => {
      component.logout();
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(AuthActions.logout());
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
