import { SimpleChange } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Frequency } from '@newbee/newbee/shared/util';
import {
  testBaseCreateTeamDto1,
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
        expect(component.name.emit).toBeCalledTimes(1);
        expect(component.name.emit).toBeCalledWith(testTeam1.name);
      });
    });

    describe('slug & formattedSlug', () => {
      it('should emit whenever the user types and after the slug input directive formats', fakeAsync(() => {
        component.createTeamForm.controls.slug.setValue(testTeam1.slug);
        tick(600);
        expect(component.slug.emit).toBeCalledTimes(1);
        expect(component.slug.emit).toBeCalledWith(testTeam1.slug);
        expect(component.formattedSlug.emit).toBeCalledTimes(1);
        expect(component.formattedSlug.emit).toBeCalledWith(testTeam1.slug);
      }));
    });

    describe('create', () => {
      it('should emit create', () => {
        component.emitCreate();
        expect(component.create.emit).toBeCalledTimes(1);
        expect(component.create.emit).toBeCalledWith({
          name: '',
          slug: '',
          upToDateDuration: null,
        });

        component.createTeamForm.patchValue({
          name: testTeam1.name,
          slug: testTeam1.slug,
        });
        component.emitCreate();
        expect(component.create.emit).toBeCalledTimes(2);
        expect(component.create.emit).toBeCalledWith(testBaseCreateTeamDto1);

        component.createTeamForm.patchValue({
          upToDateDuration: { num: 1, frequency: Frequency.Year },
        });
        component.emitCreate();
        expect(component.create.emit).toBeCalledTimes(3);
        expect(component.create.emit).toBeCalledWith({
          ...testBaseCreateTeamDto1,
          upToDateDuration: 'P1Y',
        });
      });
    });
  });

  describe('changes', () => {
    it('should update form for generatedSlug changes', () => {
      component.ngOnChanges({
        generatedSlug: new SimpleChange('', testTeam1.slug, true),
      });
      expect(component.createTeamForm.controls.slug.value).toEqual(
        testTeam1.slug,
      );
      expect(component.slug.emit).not.toBeCalled();
    });
  });
});
