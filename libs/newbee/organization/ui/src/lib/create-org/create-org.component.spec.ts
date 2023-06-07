import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('outputs', () => {
    describe('create', () => {
      it('should emit create', () => {
        jest.spyOn(component.create, 'emit');
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
});
