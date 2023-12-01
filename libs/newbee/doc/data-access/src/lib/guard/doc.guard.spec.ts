import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { DocActions, initialDocState } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword, testDoc1, testDocRelation1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { docGuard } from './doc.guard';

describe('qnaGuard', () => {
  let store: MockStore;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Doc]: {
              ...initialDocState,
              selectedDoc: testDocRelation1,
            },
          },
        }),
        provideRouter([
          {
            path: `:${ShortUrl.Doc}`,
            component: EmptyComponent,
            canActivate: [docGuard],
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
    await expect(router.navigate([`/${testDoc1.slug}`])).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      DocActions.getDoc({ slug: testDoc1.slug }),
    );
    expect(location.path()).toEqual(`/${testDoc1.slug}`);
  });
});
