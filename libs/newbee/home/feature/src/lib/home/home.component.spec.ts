import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { AuthenticatedHomeComponent } from '@newbee/newbee/home/ui';
import {
  AuthActions,
  authFeature,
  OrganizationActions,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import {
  keywordToRoute,
  RouteKeyword,
  testSelectOptionOrganization1,
  testSelectOptionOrganization2,
} from '@newbee/newbee/shared/util';
import {
  testBaseQueryDto1,
  testBaseSuggestDto1,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testOrganization2,
  testOrgMemberInviteRelation1,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedHomeComponent],
      declarations: [HomeComponent],
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

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('store', () => {
    it('should set component properties', () => {
      store.overrideSelector(authFeature.selectUser, testUser1);
      store.overrideSelector(organizationFeature.selectOrganizationState, {
        organizations: [testOrganization1, testOrganization2],
        selectedOrganization: testOrgMemberRelation1,
        invites: [testOrgMemberInviteRelation1],
      });
      store.refreshState();
      fixture.detectChanges();

      expect(component.user$).toBeObservable(hot('a', { a: testUser1 }));
      expect(component.organizationOptions).toEqual([
        testSelectOptionOrganization1,
        testSelectOptionOrganization2,
      ]);
      expect(component.selectedOrganization).toEqual(
        testSelectOptionOrganization1
      );
    });
  });

  describe('selectOrganization', () => {
    it('should dispatch getAndSelectOrg', (done) => {
      component.selectOrganization(testOrganization1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              OrganizationActions.getAndSelectOrg({
                orgSlug: testOrganization1.slug,
              })
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

  describe('search', () => {
    it('should dispatch search', (done) => {
      component.search(testBaseQueryDto1.query);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              SearchActions.search({ query: testBaseQueryDto1 })
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

  describe('suggest', () => {
    it('should dispatch suggest', (done) => {
      component.suggest(testBaseSuggestDto1.query);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              SearchActions.suggest({ query: testBaseSuggestDto1 })
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

  describe('navigateToLink', () => {
    it('should call navigate', async () => {
      await component.navigateToLink(RouteKeyword.CreateDoc);
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith([
        keywordToRoute[RouteKeyword.CreateDoc],
      ]);
    });
  });
});
