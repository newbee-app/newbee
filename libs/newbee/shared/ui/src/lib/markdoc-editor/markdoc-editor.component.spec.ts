import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { MarkdocEditorComponent } from './markdoc-editor.component';

describe('MarkdocEditorComponent', () => {
  let component: MarkdocEditorComponent;
  let fixture: ComponentFixture<MarkdocEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarkdocEditorComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue(
        createMock<MediaQueryList>({
          matches: true,
        }),
      ),
    });
  });

  describe('browser-side', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MarkdocEditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('useDarkTheme', () => {
      it('should return true if window.matchMedia is not supported or dark theme is preferred', () => {
        expect(component.useDarkTheme).toBeTruthy();
      });

      it('should return false if window.matchMedia says light theme is preferred', () => {
        window.matchMedia = jest
          .fn()
          .mockReturnValue(createMock<MediaQueryList>({ matches: false }));
        expect(component.useDarkTheme).toBeFalsy();
      });
    });
  });

  describe('server-side', () => {
    beforeEach(() => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      fixture = TestBed.createComponent(MarkdocEditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return true on the server-side', () => {
      expect(component.useDarkTheme).toBeTruthy();
    });
  });
});
