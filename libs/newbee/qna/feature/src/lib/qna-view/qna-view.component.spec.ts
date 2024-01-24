import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ViewQnaComponent } from '@newbee/newbee/qna/ui';
import {
  QnaActions,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMemberRelation1,
  testQna1,
  testQnaRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { QnaViewComponent } from './qna-view.component';

describe('QnaViewComponent', () => {
  let component: QnaViewComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewQnaComponent],
      declarations: [QnaViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Qna]: {
              ...initialQnaState,
              selectedQna: testQnaRelation1,
            },
            [Keyword.Organization]: {
              ...initialOrganizationState,
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: QnaViewComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Qna}/${testQna1.slug}`,
      QnaViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the current org', async () => {
      await component.onOrgNavigate({ route: 'test' });
      expect(router.url).toEqual('/test');
    });
  });

  describe('onQnaNavigate', () => {
    it('should navigate relative to the current qna', async () => {
      await component.onQnaNavigate({ route: Keyword.Edit });
      expect(router.url).toEqual(
        `/${ShortUrl.Qna}/${testQna1.slug}/${Keyword.Edit}`,
      );
    });
  });

  describe('onMarkAsUpToDate', () => {
    it('should dispatch markQnaAsUpToDate', () => {
      component.onMarkAsUpToDate();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        QnaActions.markQnaAsUpToDate(),
      );
    });
  });
});
