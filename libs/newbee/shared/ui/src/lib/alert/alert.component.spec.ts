import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertType } from '@newbee/newbee/shared/util';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.showChange, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('alertType', () => {
    it('should return correct alert type', () => {
      expect(component.alertType).toEqual('alert-error');
      component.type = AlertType.Info;
      expect(component.alertType).toEqual('alert-info');
      component.type = AlertType.Success;
      expect(component.alertType).toEqual('alert-success');
      component.type = AlertType.Warning;
      expect(component.alertType).toEqual('alert-warning');
    });
  });

  describe('hide', () => {
    it('should set show to false and emit output', () => {
      component.hide();
      expect(component.show).toBeFalsy();
      expect(component.showChange.emit).toHaveBeenCalledTimes(1);
      expect(component.showChange.emit).toHaveBeenCalledWith(false);
    });
  });
});
