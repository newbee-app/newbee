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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
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

  describe('searchbar', () => {
    it('should dispatch searchTerm$ and searchTerm$ should dispatch suggest', (done) => {
      component.searchTerm$.subscribe({
        next: (searchTerm) => {
          try {
            expect(searchTerm).toEqual(testBaseSuggestDto1.query);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      component.searchbar(testBaseSuggestDto1.query);
    });

    it('should dispatch suggest', fakeAsync(() => {
      jest.spyOn(store, 'dispatch');
      component.searchbar(testBaseSuggestDto1.query);
      tick(300);
      expect(store.dispatch).toBeCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(
        SearchActions.suggest({ query: testBaseSuggestDto1 })
      );
    }));
  });
});
