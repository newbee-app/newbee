import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ViewDocComponent } from '@newbee/newbee/doc/ui';
import {
  DocActions,
  initialDocState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testDoc1,
  testDocRelation1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocViewComponent } from './doc-view.component';

describe('DocViewComponent', () => {
  let component: DocViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocComponent],
      declarations: [DocViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Doc]: {
              ...initialDocState,
              selectedDoc: testDocRelation1,
            },
            [Keyword.Organization]: {
              ...initialOrganizationState,
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: DocViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Doc}/${testDoc1.slug}`,
      DocViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navgiate relative to the current org', async () => {
      await component.onOrgNavigate({ route: 'test' });
      expect(router.url).toEqual('/test');
    });
  });

  describe('onDocNavigate', () => {
    it('should navigate relative to the current doc', async () => {
      await component.onDocNavigate({ route: Keyword.Edit });
      expect(router.url).toEqual(
        `/${ShortUrl.Doc}/${testDoc1.slug}/${Keyword.Edit}`,
      );
    });
  });

  describe('onMarkAsUpToDate', () => {
    it('should dispatch markDocAsUpToDate', () => {
      component.onMarkAsUpToDate();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        DocActions.markDocAsUpToDate(),
      );
    });
  });
});
