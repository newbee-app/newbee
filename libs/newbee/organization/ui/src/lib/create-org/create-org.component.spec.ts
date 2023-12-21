import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Frequency } from '@newbee/newbee/shared/util';
import { testOrganization1 } from '@newbee/shared/util';
import { CreateOrgComponent } from './create-org.component';

describe('CreateOrgComponent', () => {
  let component: CreateOrgComponent;
  let fixture: ComponentFixture<CreateOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrgComponent);
    component = fixture.componentInstance;

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
        component.createOrgForm.controls.name.setValue(testOrganization1.name);
        expect(component.name.emit).toHaveBeenCalledTimes(1);
        expect(component.name.emit).toHaveBeenCalledWith(
          testOrganization1.name,
        );
        expect(component.slug.emit).not.toHaveBeenCalled();
        expect(component.formattedSlug.emit).not.toHaveBeenCalled();
      });
    });

    describe('slug & formattedSlug', () => {
      it('should emit whenever the user types and after the slug input directive formats', fakeAsync(() => {
        component.createOrgForm.controls.slug.setValue(testOrganization1.slug);
        tick(600);
        expect(component.slug.emit).toHaveBeenCalledTimes(1);
        expect(component.slug.emit).toHaveBeenCalledWith(
          testOrganization1.slug,
        );
        expect(component.formattedSlug.emit).toHaveBeenCalledTimes(1);
        expect(component.formattedSlug.emit).toHaveBeenCalledWith(
          testOrganization1.slug,
        );
        expect(component.name.emit).not.toHaveBeenCalled();
        expect(component.slug.emit).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
      }));
    });

    describe('create', () => {
      it('should emit create', () => {
        component.emitCreate();
        expect(component.create.emit).toHaveBeenCalledTimes(1);
        expect(component.create.emit).toHaveBeenCalledWith({
          name: '',
          slug: '',
          upToDateDuration: 'P6M',
        });

        component.createOrgForm.setValue({
          name: 'NewBee',
          slug: '',
          upToDateDuration: {
            num: 1,
            frequency: Frequency.Year,
          },
        });
        component.emitCreate();
        expect(component.create.emit).toHaveBeenCalledTimes(2);
        expect(component.create.emit).toHaveBeenCalledWith({
          name: 'NewBee',
          slug: '',
          upToDateDuration: 'P1Y',
        });
      });
    });
  });

  describe('setters', () => {
    it('should update form for generatedSlug changes', fakeAsync(() => {
      component.generatedSlug = testOrganization1.slug;
      expect(component.createOrgForm.controls.slug.value).toEqual(
        testOrganization1.slug,
      );
      tick(600);
      expect(component.slug.emit).not.toHaveBeenCalled();
    }));
  });
});
