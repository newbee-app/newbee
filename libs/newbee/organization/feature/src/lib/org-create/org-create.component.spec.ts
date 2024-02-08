import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { initialOrganizationState } from '@newbee/newbee/organization/data-access';
import { CreateOrgComponent } from '@newbee/newbee/organization/ui';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  testCreateOrganizationDto1,
  testOrganization1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgCreateComponent } from './org-create.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('OrgCreateComponent', () => {
  let component: OrgCreateComponent;
  let fixture: ComponentFixture<OrgCreateComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CreateOrgComponent],
      declarations: [OrgCreateComponent],
      providers: [
        provideMockStore({
          initialState: {
            [`${Keyword.Organization}Module`]: initialOrganizationState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgCreateComponent);
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

  describe('onName', () => {
    it('should dispatch generateSlug', fakeAsync(() => {
      component.onName(testOrganization1.name);
      tick(600);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.generateSlug({ name: testOrganization1.name }),
      );
    }));
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

  describe('onCreate', () => {
    it('should dispatch createOrg', () => {
      component.onCreate(testCreateOrganizationDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        OrganizationActions.createOrg({
          createOrganizationDto: testCreateOrganizationDto1,
        }),
      );
    });
  });
});
