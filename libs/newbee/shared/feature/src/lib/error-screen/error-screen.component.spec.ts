import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { TemplateMarkerDirectiveModule } from '@newbee/newbee/shared/util';
import { provideMockStore } from '@ngrx/store/testing';
import { ErrorScreenComponent } from './error-screen.component';

@Component({
  standalone: true,
  imports: [CommonModule, TemplateMarkerDirectiveModule, ErrorScreenComponent],
  template: `
    <newbee-error-screen>
      <ng-template newbeeTemplateMarker>
        <p>Hello</p>
      </ng-template>
    </newbee-error-screen>
  `,
})
class TestComponent {
  @ViewChild(ErrorScreenComponent) errorScreenComponent!: ErrorScreenComponent;
}

describe('ErrorScreenComponent', () => {
  let component: ErrorScreenComponent;
  let fixture: ComponentFixture<TestComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    router = TestBed.inject(Router);

    fixture.detectChanges();

    component = fixture.componentInstance.errorScreenComponent;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onNavigateHome', () => {
    it('should navigate home', async () => {
      await component.onNavigateHome();
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith(['/']);
    });
  });
});
