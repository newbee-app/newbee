import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { EditOrgComponent } from '@newbee/newbee/organization/ui';
import {
  testEditOrgForm1,
  testEditOrgSlugForm1,
} from '@newbee/newbee/organization/util';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { ErrorScreenComponent } from '@newbee/newbee/shared/feature';
import { testOrganization1 } from '@newbee/shared/util';
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
      imports: [
        CommonModule,
        NavbarComponent,
        EditOrgComponent,
        ErrorScreenComponent,
      ],
      declarations: [OrgEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            org: { selectedOrganization: testOrganization1 },
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
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.typingSlug({ slug: testOrganization1.slug })
      );
    });
  });

  describe('onFormattedSlug', () => {
    it('should dispatch checkSlug', () => {
      component.onFormattedSlug(testOrganization1.slug);
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.checkSlug({ slug: testOrganization1.slug })
      );
    });
  });

  describe('onEdit', () => {
    it('should dispatch editOrg', () => {
      component.onEdit(testEditOrgForm1);
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.editOrg({
          updateOrganizationDto: { name: testEditOrgForm1.name ?? '' },
        })
      );
    });
  });

  describe('onEditSlug', () => {
    it('should dispatch editOrgSlug', () => {
      component.onEditSlug(testEditOrgSlugForm1);
      expect(store.dispatch).toBeCalledWith(
        OrganizationActions.editOrgSlug({
          updateOrganizationDto: { slug: testEditOrgSlugForm1.slug ?? '' },
        })
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteOrg', () => {
      component.onDelete();
      expect(store.dispatch).toBeCalledWith(OrganizationActions.deleteOrg());
    });
  });
});
