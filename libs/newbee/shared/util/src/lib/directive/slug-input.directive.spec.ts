import { Component } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SlugPipeModule } from '../pipe';
import { SlugInputDirective } from './slug-input.directive';

@Component({
  template: `<input
    id="input"
    type="text"
    [formControl]="control"
    newbeeSlugInput
    (slug)="slug = $event"
  /> `,
})
class TestComponent {
  control = new FormControl('');
  slug = '';
}

describe('SlugInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SlugPipeModule],
      declarations: [TestComponent, SlugInputDirective],
    }).createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('delayed format', () => {
    it('should format the input after a delay and emit', fakeAsync(() => {
      component.control.setValue('Sométhïng to Fôrmat');
      tick(600);
      expect(component.control.value).toEqual('something-to-format');
      expect(component.slug).toEqual('something-to-format');
      discardPeriodicTasks();
    }));
  });
});
