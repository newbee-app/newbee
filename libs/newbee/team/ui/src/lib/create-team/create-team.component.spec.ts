import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Frequency } from '@newbee/newbee/shared/util';
import {
  testCreateTeamDto1,
  testOrganization1,
  testTeam1,
} from '@newbee/shared/util';
import { CreateTeamComponent } from './create-team.component';

describe('CreateTeamComponent', () => {
  let component: CreateTeamComponent;
  let fixture: ComponentFixture<CreateTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTeamComponent);
    component = fixture.componentInstance;

    component.organization = testOrganization1;

    jest.spyOn(component.name, 'emit');
    jest.spyOn(component.slug, 'emit');
    jest.spyOn(component.formattedSlug, 'emit');
    jest.spyOn(component.create, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('outputs', () => {
    describe('name', () => {
      it('should emit whenever name changes in form', () => {
        component.createTeamForm.controls.name.setValue(testTeam1.name);
        expect(component.name.emit).toHaveBeenCalledTimes(1);
        expect(component.name.emit).toHaveBeenCalledWith(testTeam1.name);
      });
    });

    describe('slug & formattedSlug', () => {
      it('should emit whenever the user types and after the slug input directive formats', fakeAsync(() => {
        component.createTeamForm.controls.slug.setValue(testTeam1.slug);
        tick(600);
        expect(component.slug.emit).toHaveBeenCalledTimes(1);
        expect(component.slug.emit).toHaveBeenCalledWith(testTeam1.slug);
        expect(component.formattedSlug.emit).toHaveBeenCalledTimes(1);
        expect(component.formattedSlug.emit).toHaveBeenCalledWith(
          testTeam1.slug,
        );
      }));
    });

    describe('create', () => {
      it('should emit create', () => {
        component.emitCreate();
        expect(component.create.emit).toHaveBeenCalledTimes(1);
        expect(component.create.emit).toHaveBeenCalledWith({
          name: '',
          slug: '',
          upToDateDuration: null,
        });

        component.createTeamForm.patchValue({
          name: testTeam1.name,
          slug: testTeam1.slug,
        });
        component.emitCreate();
        expect(component.create.emit).toHaveBeenCalledTimes(2);
        expect(component.create.emit).toHaveBeenCalledWith(testCreateTeamDto1);

        component.createTeamForm.patchValue({
          upToDateDuration: { num: 1, frequency: Frequency.Year },
        });
        component.emitCreate();
        expect(component.create.emit).toHaveBeenCalledTimes(3);
        expect(component.create.emit).toHaveBeenCalledWith({
          ...testCreateTeamDto1,
          upToDateDuration: 'P1Y',
        });
      });
    });
  });

  describe('setters', () => {
    it('should update form for generatedSlug changes', () => {
      component.generatedSlug = testTeam1.slug;
      expect(component.createTeamForm.controls.slug.value).toEqual(
        testTeam1.slug,
      );
      expect(component.slug.emit).not.toHaveBeenCalled();
    });
  });
});
