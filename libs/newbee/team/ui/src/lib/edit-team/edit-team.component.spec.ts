import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
