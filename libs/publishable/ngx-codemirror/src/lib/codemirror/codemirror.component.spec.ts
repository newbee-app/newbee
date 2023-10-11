import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodemirrorComponent } from './codemirror.component';

describe('CodemirrorComponent', () => {
  let component: CodemirrorComponent;
  let fixture: ComponentFixture<CodemirrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CodemirrorComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  describe('browser-side', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CodemirrorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create view', () => {
      expect(component.view).not.toBeNull();
    });

    it('wrapper should match', () => {
      const wrapperDiv: HTMLDivElement | null =
        fixture.nativeElement.querySelector('div');
      expect(wrapperDiv).toEqual(component.wrapper.nativeElement);
    });
  });

  describe('server-side', () => {
    beforeEach(() => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      fixture = TestBed.createComponent(CodemirrorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not create view', () => {
      expect(component.view).toBeNull();
    });
  });
});
