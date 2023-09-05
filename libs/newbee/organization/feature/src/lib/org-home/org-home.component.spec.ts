import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { OrgSearchbarComponent } from '@newbee/newbee/organization/ui';
import {
  initialSearchState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import {
  testBaseQueryDto1,
  testBaseSuggestDto1,
} from '@newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
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
  let fixture: ComponentFixture<OrgHomeComponent>;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, OrgSearchbarComponent],
      declarations: [OrgHomeComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: { ...initialSearchState, suggestions: [] },
          },
        }),
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: createMock<ActivatedRoute>(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgHomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('onSearch', () => {
    it('should navigate to search', async () => {
      await component.onSearch(testBaseQueryDto1.query);
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(
        [`${Keyword.Search}/${testBaseQueryDto1.query}`],
        { relativeTo: route }
      );
    });
  });

  describe('onSearchbar', () => {
    it('should dispatch suggest', fakeAsync(() => {
      component.onSearchbar(testBaseSuggestDto1.query);
      tick(300);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        SearchActions.suggest({ query: testBaseSuggestDto1 })
      );
    }));
  });
});
