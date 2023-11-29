import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectOption, durationToNumAndFreq } from '@newbee/newbee/shared/util';
import {
  testDoc1,
  testDocRelation1,
  testOrgMember1,
  testOrganization1,
  testTeam1,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { EditDocComponent } from './edit-doc.component';

describe('EditDocComponent', () => {
  let component: EditDocComponent;
  let fixture: ComponentFixture<EditDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDocComponent);
    component = fixture.componentInstance;

    component.doc = testDocRelation1;
    component.orgMember = testOrgMember1;
    component.organization = testOrganization1;
    component.teams = [testTeam1];

    jest.spyOn(component.edit, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should fill information with doc values', () => {
      expect(component.docMarkdoc).toEqual(testDoc1.docMarkdoc);
      expect(component.teamOptions).toEqual([
        new SelectOption(null, 'Entire org'),
        new SelectOption(testTeam1, testTeam1.name),
      ]);
      expect(component.editDocForm.value).toEqual({
        title: testDoc1.title,
        team: testDocRelation1.team,
        upToDateDuration: testDoc1.upToDateDuration
          ? durationToNumAndFreq(dayjs.duration(testDoc1.upToDateDuration))
          : { num: null, frequency: null },
      });
    });
  });

  describe('emitEdit', () => {
    it('should emit doc values', () => {
      component.emitEdit();
      expect(component.edit.emit).toBeCalledTimes(1);
      expect(component.edit.emit).toBeCalledWith({
        title: testDoc1.title,
        team: testDocRelation1.team?.slug ?? null,
        upToDateDuration: testDoc1.upToDateDuration,
        docMarkdoc: testDoc1.docMarkdoc,
      });
    });
  });
});
