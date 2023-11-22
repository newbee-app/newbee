import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Frequency, SelectOption } from '@newbee/newbee/shared/util';
import {
  testBaseCreateDocDto1,
  testDoc1,
  testOrganization1,
  testTeam1,
} from '@newbee/shared/util';
import { CreateDocComponent } from './create-doc.component';

describe('CreateDocComponent', () => {
  let component: CreateDocComponent;
  let fixture: ComponentFixture<CreateDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDocComponent);
    component = fixture.componentInstance;

    component.organization = testOrganization1;
    component.teams = [testTeam1];

    jest.spyOn(component.create, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should initialize team options and doc form', () => {
      expect(component.teamOptions).toEqual([
        new SelectOption(null, 'Entire org'),
        new SelectOption(testTeam1, testTeam1.name),
      ]);
      expect(component.docForm.value.team).toBeNull();

      component.teamSlugParam = testTeam1.slug;
      component.ngOnInit();
      expect(component.docForm.value.team).toEqual(testTeam1);
    });
  });

  describe('emitCreate', () => {
    it('should emit create output', () => {
      component.emitCreate();
      expect(component.create.emit).toBeCalledTimes(1);
      expect(component.create.emit).toBeCalledWith({
        title: '',
        team: null,
        docMarkdoc: '',
        upToDateDuration: null,
      });

      component.docForm.patchValue({
        title: testDoc1.title,
        team: testTeam1,
        upToDateDuration: { num: 1, frequency: Frequency.Year },
      });
      component.docMarkdoc = testDoc1.docMarkdoc;
      component.emitCreate();
      expect(component.create.emit).toBeCalledTimes(2);
      expect(component.create.emit).toBeCalledWith(testBaseCreateDocDto1);
    });
  });
});
