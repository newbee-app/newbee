import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialDocState as initialDocModuleState } from '@newbee/newbee/doc/data-access';
import { EditDocComponent } from '@newbee/newbee/doc/ui';
import {
  DocActions,
  initialAuthState,
  initialDocState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  testBaseUpdateDocDto1,
  testDocRelation1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocEditComponent } from './doc-edit.component';

describe('DocEditComponent', () => {
  let component: DocEditComponent;
  let fixture: ComponentFixture<DocEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDocComponent],
      declarations: [DocEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Doc]: {
              ...initialDocState,
              selectedDoc: testDocRelation1,
            },
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
            [Keyword.Auth]: {
              ...initialAuthState,
              user: testUser1,
            },
            [`${Keyword.Doc}Module`]: initialDocModuleState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocEditComponent);
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

  describe('onEdit', () => {
    it('should dispatch editDoc', () => {
      component.onEdit(testBaseUpdateDocDto1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        DocActions.editDoc({ updateDocDto: testBaseUpdateDocDto1 }),
      );
    });
  });

  describe('onMarkAsUpToDate', () => {
    it('should dispatch markDocAsUpToDate', () => {
      component.onMarkAsUpToDate();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        DocActions.markDocAsUpToDate(),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteDoc', () => {
      component.onDelete();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(DocActions.deleteDoc());
    });
  });
});
