import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { DocActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocRootComponent } from './doc-root.component';

describe('DocRootComponent', () => {
  let component: DocRootComponent;
  let fixture: ComponentFixture<DocRootComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [DocRootComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocRootComponent);
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

  describe('ngOnDestroy', () => {
    it('should dispatch resetSelectedDoc', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toBeCalledWith(DocActions.resetSelectedDoc());
    });
  });
});
