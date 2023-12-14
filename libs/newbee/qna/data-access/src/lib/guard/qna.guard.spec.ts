import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { QnaActions, initialQnaState } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword, testQna1, testQnaRelation1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { qnaGuard } from './qna.guard';

describe('qnaGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Qna]: {
              ...initialQnaState,
              selectedQna: testQnaRelation1,
            },
          },
        }),
        provideRouter([
          {
            path: `:${ShortUrl.Qna}`,
            component: EmptyComponent,
            canActivate: [qnaGuard],
          },
          {
            path: '',
            component: EmptyComponent,
          },
        ]),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should dispatch store and navigate', async () => {
    await expect(router.navigate([`/${testQna1.slug}`])).resolves.toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      QnaActions.getQna({ slug: testQna1.slug }),
    );
    expect(location.path()).toEqual(`/${testQna1.slug}`);
  });
});
