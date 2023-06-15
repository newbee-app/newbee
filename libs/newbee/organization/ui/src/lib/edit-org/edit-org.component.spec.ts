import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  OrgRoleEnum,
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { EditOrgComponent } from './edit-org.component';

describe('EditOrgComponent', () => {
  let component: EditOrgComponent;
  let fixture: ComponentFixture<EditOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrgComponent);
    component = fixture.componentInstance;

    component.orgMember = testOrgMemberRelation1;

    jest.spyOn(component.slug, 'emit');
    jest.spyOn(component.formattedSlug, 'emit');
    jest.spyOn(component.edit, 'emit');
    jest.spyOn(component.editSlug, 'emit');
    jest.spyOn(component.delete, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('outputs', () => {
    describe('slug', () => {
      it('should emit whenever the slug input is changed', () => {
        component.editOrgSlugForm.setValue({ slug: testOrganization2.slug });
        expect(component.slug.emit).toBeCalledTimes(1);
        expect(component.slug.emit).toBeCalledWith(testOrganization2.slug);
      });
    });

    describe('formattedSlug', () => {
      it('should emit whenever the slug input is formatted', fakeAsync(() => {
        expect(component.formattedSlug.emit).toBeCalledTimes(1);
        expect(component.formattedSlug.emit).toBeCalledWith(
          testOrganization1.slug
        );
        component.editOrgSlugForm.setValue({ slug: testOrganization2.slug });
        tick(600);
        expect(component.formattedSlug.emit).toBeCalledTimes(2);
        expect(component.formattedSlug.emit).toBeCalledWith(
          testOrganization2.slug
        );
      }));
    });

    describe('edit', () => {
      it('should emit edit', () => {
        component.emitEdit();
        expect(component.edit.emit).toBeCalledTimes(1);
        expect(component.edit.emit).toBeCalledWith({
          name: testOrganization1.name,
        });
      });
    });

    describe('editSlug', () => {
      it('should emit editSlug', () => {
        component.emitEditSlug();
        expect(component.editSlug.emit).toBeCalledTimes(1);
        expect(component.editSlug.emit).toBeCalledWith({
          slug: testOrganization1.slug,
        });
      });
    });

    describe('delete', () => {
      it('should emit delete', () => {
        component.emitDelete();
        expect(component.delete.emit).toBeCalledTimes(1);
        expect(component.delete.emit).toBeCalledWith();
      });
    });
  });

  describe('getters', () => {
    describe('editDistinct', () => {
      it('should be true when edit org form is distinct from org, false otherwise', () => {
        expect(component.editDistinct).toBeFalsy();
        component.editOrgForm.setValue({ name: testOrganization2.name });
        expect(component.editDistinct).toBeTruthy();
      });
    });

    describe('editSlugDistinct', () => {
      it('should be true when edit org slug form is distinct from org, false otherwise', () => {
        expect(component.editSlugDistinct).toBeFalsy();
        component.editOrgSlugForm.setValue({ slug: testOrganization2.slug });
        expect(component.editSlugDistinct).toBeTruthy();
      });
    });

    describe('delteSlugMatches', () => {
      it(`should be true if the delete org form's slug matches the org's, false otherwise`, () => {
        expect(component.deleteSlugMatches).toBeFalsy();
        component.deleteOrgForm.setValue({ slug: testOrganization1.slug });
        expect(component.deleteSlugMatches).toBeTruthy();
      });
    });

    describe('isOwner', () => {
      it('should be true if org member is the owner of the org, false otherwise', () => {
        expect(component.isOwner).toBeTruthy();
        component.orgMember.orgMember.role = OrgRoleEnum.Moderator;
        expect(component.isOwner).toBeFalsy();
      });
    });
  });
});
