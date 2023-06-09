import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { OrgSearchbarComponent } from '@newbee/newbee/organization/ui';
import { SearchActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseQueryDto1,
  testBaseSuggestDto1,
} from '@newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgHomeComponent } from './org-home.component';

describe('OrgHomeComponent', () => {
  let component: OrgHomeComponent;
  let fixture: ComponentFixture<OrgHomeComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NavbarComponent, OrgSearchbarComponent],
      declarations: [OrgHomeComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgHomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('search', () => {
    it('should dispatch search', () => {
      component.search(testBaseQueryDto1.query);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        SearchActions.search({ query: testBaseQueryDto1 })
      );
    });
  });

  describe('searchbar', () => {
    it('should dispatch suggest', fakeAsync(() => {
      component.searchbar(testBaseSuggestDto1.query);
      tick(300);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        SearchActions.suggest({ query: testBaseSuggestDto1 })
      );
    }));
  });
});
