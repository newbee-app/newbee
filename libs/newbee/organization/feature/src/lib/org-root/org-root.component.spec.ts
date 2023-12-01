import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgRootComponent } from './org-root.component';

describe('OrgRootComponent', () => {
  let component: OrgRootComponent;
  let fixture: ComponentFixture<OrgRootComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [OrgRootComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgRootComponent);
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
    it('should dispatch resetSelectedOrg', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.resetSelectedOrg(),
      );
    });
  });
});
