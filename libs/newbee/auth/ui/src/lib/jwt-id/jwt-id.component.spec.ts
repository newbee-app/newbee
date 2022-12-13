import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testUser1 } from '@newbee/shared/util';
import { BaseFormComponentModule } from '../base-form';

import { JwtIdComponent } from './jwt-id.component';

describe('JwtIdComponent', () => {
  let component: JwtIdComponent;
  let fixture: ComponentFixture<JwtIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BaseFormComponentModule],
      declarations: [JwtIdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JwtIdComponent);
    component = fixture.componentInstance;

    component.email = testUser1.email;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('resendLink', () => {
    let resendLinkEmitSpy: jest.SpyInstance;

    beforeEach(() => {
      resendLinkEmitSpy = jest.spyOn(component.resendLink, 'emit');
    });

    it('should be defined', () => {
      expect(resendLinkEmitSpy).toBeDefined();
    });

    it('should emit using emitResendLink', () => {
      component.emitResendLink();
      expect(resendLinkEmitSpy).toBeCalledTimes(1);
      expect(resendLinkEmitSpy).toBeCalledWith(component.email);
    });

    it('should emit with link click', () => {
      const resendLinkElement: HTMLAnchorElement | null =
        fixture.nativeElement.querySelector('#resend-link');
      resendLinkElement?.click();
      expect(resendLinkEmitSpy).toBeCalledTimes(1);
      expect(resendLinkEmitSpy).toBeCalledWith(component.email);
    });
  });
});
