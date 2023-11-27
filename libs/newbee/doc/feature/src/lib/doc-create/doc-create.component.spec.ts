import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CreateDocComponent } from '@newbee/newbee/doc/ui';
import {
  DocActions,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testBaseCreateDocDto1,
  testOrgMemberRelation1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocCreateComponent } from './doc-create.component';

describe('DocCreateComponent', () => {
  let component: DocCreateComponent;
  let fixture: ComponentFixture<DocCreateComponent>;
  let store: MockStore;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDocComponent],
      declarations: [DocCreateComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(route).toBeDefined();
  });

  describe('onCreate', () => {
    it('should dispatch createDoc', () => {
      component.onCreate(testBaseCreateDocDto1);
      expect(store.dispatch).toBeCalledWith(
        DocActions.createDoc({ createDocDto: testBaseCreateDocDto1 }),
      );
    });
  });
});
