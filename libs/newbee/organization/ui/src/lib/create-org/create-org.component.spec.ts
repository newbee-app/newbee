import { SimpleChange } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
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
        component.createOrgForm.get('name')?.setValue(testOrganization1.name);
        expect(component.name.emit).toBeCalledTimes(1);
        expect(component.name.emit).toBeCalledWith(testOrganization1.name);
        expect(component.slug.emit).not.toBeCalled();
        expect(component.formattedSlug.emit).not.toBeCalled();
      });
    });

    describe('slug & formattedSlug', () => {
      it('should emit whenever the user types and after the slug input directive formats', fakeAsync(() => {
        component.createOrgForm.get('slug')?.setValue(testOrganization1.slug);
        expect(component.slug.emit).toBeCalledTimes(1);
        expect(component.slug.emit).toBeCalledWith(testOrganization1.slug);
        tick(600);
        expect(component.formattedSlug.emit).toBeCalledTimes(1);
        expect(component.formattedSlug.emit).toBeCalledWith(
          testOrganization1.slug
        );
        expect(component.name.emit).not.toBeCalled();
        expect(component.slug.emit).toBeCalledTimes(1);
        discardPeriodicTasks();
      }));
    });

    describe('create', () => {
      it('should emit create', () => {
        component.emitCreate();
        expect(component.create.emit).toBeCalledTimes(1);
        expect(component.create.emit).toBeCalledWith({ name: '', slug: '' });

        component.createOrgForm.setValue({ name: 'NewBee', slug: '' });
        component.emitCreate();
        expect(component.create.emit).toBeCalledTimes(2);
        expect(component.create.emit).toBeCalledWith({
          name: 'NewBee',
          slug: '',
        });
      });
    });
  });

  describe('changes', () => {
    it('should update form for generatedSlug changes', fakeAsync(() => {
      component.ngOnChanges({
        generatedSlug: new SimpleChange('', testOrganization1.slug, true),
      });
      expect(component.createOrgForm.get('slug')?.value).toEqual(
        testOrganization1.slug
      );
      tick(600);
      expect(component.slug.emit).not.toBeCalled();
    }));
  });
});
