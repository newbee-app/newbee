import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { provideMockStore } from '@ngrx/store/testing';
import { ErrorScreenComponent } from './error-screen.component';

describe('ErrorScreenComponent', () => {
  let component: ErrorScreenComponent;
  let fixture: ComponentFixture<ErrorScreenComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorScreenComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: createMock<Router>(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorScreenComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
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
