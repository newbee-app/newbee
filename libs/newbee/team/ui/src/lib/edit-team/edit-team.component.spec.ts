import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Frequency } from '@newbee/newbee/shared/util';
import {
  OrgRoleEnum,
  testOrganization1,
  testOrgMember1,
  testTeam1,
  testTeamMember1,
} from '@newbee/shared/util';
import { EditTeamComponent } from './edit-team.component';

describe('EditTeamComponent', () => {
  let component: EditTeamComponent;
  let fixture: ComponentFixture<EditTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTeamComponent);
    component = fixture.componentInstance;

    component.organization = testOrganization1;
    component.team = testTeam1;
    component.orgMember = testOrgMember1;

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
        component.editTeamSlugForm.setValue({ slug: 'newslug' });
        expect(component.slug.emit).toHaveBeenCalledTimes(1);
        expect(component.slug.emit).toHaveBeenCalledWith('newslug');
      });
    });

    describe('formattedSlug', () => {
      it('should emit whenever the slug input is formatted', fakeAsync(() => {
        expect(component.formattedSlug.emit).toHaveBeenCalledTimes(1);
        expect(component.formattedSlug.emit).toHaveBeenCalledWith(
          testTeam1.slug,
        );
        component.editTeamSlugForm.setValue({ slug: 'Newslug' });
        tick(600);
        expect(component.formattedSlug.emit).toHaveBeenCalledTimes(2);
        expect(component.formattedSlug.emit).toHaveBeenCalledWith('newslug');
      }));
    });

    describe('edit', () => {
      it('should emit edit', () => {
        component.emitEdit();
        expect(component.edit.emit).toHaveBeenCalledTimes(1);
        expect(component.edit.emit).toHaveBeenCalledWith({
          name: testTeam1.name,
          upToDateDuration: null,
        });

        component.editTeamForm.setValue({
          name: null,
          upToDateDuration: { num: 1, frequency: Frequency.Year },
        });
        component.emitEdit();
        expect(component.edit.emit).toHaveBeenCalledTimes(2);
        expect(component.edit.emit).toHaveBeenCalledWith({
          upToDateDuration: 'P1Y',
        });
      });
    });

    describe('editSlug', () => {
      it('should emit editSlug', () => {
        component.emitEditSlug();
        expect(component.editSlug.emit).toHaveBeenCalledTimes(1);
        expect(component.editSlug.emit).toHaveBeenCalledWith(testTeam1.slug);
      });
    });

    describe('delete', () => {
      it('should emit delete', () => {
        component.emitDelete();
        expect(component.delete.emit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getters', () => {
    describe('editDistinct', () => {
      it('should be true when edit team form is distinct from team, false otherwise', () => {
        expect(component.editDistinct).toBeFalsy();
        component.editTeamForm.patchValue({ name: 'new name' });
        expect(component.editDistinct).toBeTruthy();
        component.editTeamForm.patchValue({ name: testTeam1.name });
        expect(component.editDistinct).toBeFalsy();
        component.editTeamForm.patchValue({
          upToDateDuration: { num: 1, frequency: Frequency.Year },
        });
        expect(component.editDistinct).toBeTruthy();
      });
    });

    describe('editSlugDistinct', () => {
      it('should be true when edit team slug from is distinct from team, false otherwise', () => {
        expect(component.editSlugDistinct).toBeFalsy();
        component.editTeamSlugForm.setValue({ slug: 'newslug' });
        expect(component.editSlugDistinct).toBeTruthy();
      });
    });

    describe('deleteSlugMatches', () => {
      it(`should be true if the delete team form's slug matches the team's, false otherwise`, () => {
        expect(component.deleteSlugMatches).toBeFalsy();
        component.deleteTeamForm.setValue({ slug: testTeam1.slug });
        expect(component.deleteSlugMatches).toBeTruthy();
      });
    });

    describe('canAccessAdvanced', () => {
      it('should be true if org member is an admin or team member is an owner, false otherwise', () => {
        expect(component.canAccessAdvanced).toBeTruthy();
        component.orgMember = { ...testOrgMember1, role: OrgRoleEnum.Member };
        expect(component.canAccessAdvanced).toBeFalsy();
        component.teamMember = testTeamMember1;
        expect(component.canAccessAdvanced).toBeTruthy();
      });
    });
  });
});
