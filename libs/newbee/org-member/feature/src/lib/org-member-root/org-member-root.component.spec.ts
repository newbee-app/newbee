import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgMemberRootComponent } from './org-member-root.component';

describe('OrgMemberRootComponent', () => {
  let component: OrgMemberRootComponent;
  let fixture: ComponentFixture<OrgMemberRootComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgMemberRootComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgMemberRootComponent);
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
    it('should dispatch resetSelectedOrgMember', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toBeCalledWith(
        OrgMemberActions.resetSelectedOrgMember()
      );
    });
  });
});
