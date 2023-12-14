import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initialOrganizationState as initialOrganizationModuleState } from '@newbee/newbee/organization/data-access';
import { EditOrgComponent } from '@newbee/newbee/organization/ui';
import {
  OrganizationActions,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganization2,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgEditComponent } from './org-edit.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgEditComponent', () => {
  let component: OrgEditComponent;
  let fixture: ComponentFixture<OrgEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, EditOrgComponent],
      declarations: [OrgEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
            [`${Keyword.Organization}Module`]: initialOrganizationModuleState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgEditComponent);
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

  describe('onSlug', () => {
    it('should dispatch typingSlug', () => {
      component.onSlug(testOrganization1.slug);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.typingSlug({ slug: testOrganization1.slug }),
      );
    });
  });

  describe('onFormattedSlug', () => {
    it('should dispatch checkSlug', () => {
      component.onFormattedSlug(testOrganization1.slug);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.checkSlug({ slug: testOrganization1.slug }),
      );
    });
  });

  describe('onEdit', () => {
    it('should dispatch editOrg', () => {
      component.onEdit({ name: testOrganization2.name });
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.editOrg({
          updateOrganizationDto: { name: testOrganization2.name },
        }),
      );
    });
  });

  describe('onEditSlug', () => {
    it('should dispatch editOrgSlug', () => {
      component.onEditSlug({ slug: testOrganization2.slug });
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.editOrgSlug({
          updateOrganizationDto: { slug: testOrganization2.slug },
        }),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteOrg', () => {
      component.onDelete();
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.deleteOrg(),
      );
    });
  });
});
