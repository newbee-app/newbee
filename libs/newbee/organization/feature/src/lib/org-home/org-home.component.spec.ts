import { CommonModule } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { OrgSearchbarComponent } from '@newbee/newbee/organization/ui';
import {
  initialSearchState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword, testQueryDto1, testSuggestDto1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgHomeComponent } from './org-home.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgHomeComponent', () => {
  let component: OrgHomeComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, OrgSearchbarComponent],
      declarations: [OrgHomeComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: initialSearchState,
          },
        }),
        provideRouter([{ path: '**', component: OrgHomeComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', OrgHomeComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onSearch', () => {
    it('should navigate to search', async () => {
      await component.onSearch(testQueryDto1.query);
      expect(router.url).toEqual(`/${Keyword.Search}/${testQueryDto1.query}`);
    });
  });

  describe('onSearchbar', () => {
    it('should dispatch suggest', fakeAsync(() => {
      component.onSearchbar(testSuggestDto1.query);
      tick(300);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        SearchActions.suggest({ query: testSuggestDto1 }),
      );
    }));
  });
});
