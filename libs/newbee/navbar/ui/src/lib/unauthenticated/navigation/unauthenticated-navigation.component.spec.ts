import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { RouteKeyword } from '@newbee/newbee/navbar/util';
import { ClickService } from '@newbee/newbee/shared/util';
import { Subject } from 'rxjs';

import { UnauthenticatedNavigationComponent } from './unauthenticated-navigation.component';

describe('UnauthenticatedNavigationComponent', () => {
  let component: UnauthenticatedNavigationComponent;
  let fixture: ComponentFixture<UnauthenticatedNavigationComponent>;
  let clickService: ClickService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        {
          provide: ClickService,
          useValue: createMock<ClickService>({
            documentClickTarget: createMock<Subject<HTMLElement>>(),
          }),
        },
      ],
      declarations: [UnauthenticatedNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthenticatedNavigationComponent);
    component = fixture.componentInstance;
    clickService = TestBed.inject(ClickService);

    jest.spyOn(component.navigateToLink, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(clickService).toBeDefined();
  });

  it('should have initialized values properly', () => {
    expect(component.drawer.nativeElement).toEqual(
      fixture.nativeElement.querySelector('#unauthenticated-navigation-drawer')
    );
    expect(component.expandIcon.nativeElement).toEqual(
      fixture.nativeElement.querySelector('#expand-icon')
    );
    expect(component.expanded).toBeFalsy();
  });

  it('should shrink and expand properly', () => {
    component.expand();
    expect(component.expanded).toBeTruthy();
    component.shrink();
    expect(component.expanded).toBeFalsy();
  });

  it('should emit navigateToLink', () => {
    component.emitNavigateToLink(RouteKeyword.Home);
    expect(component.navigateToLink.emit).toBeCalledTimes(1);
    expect(component.navigateToLink.emit).toBeCalledWith(RouteKeyword.Home);
  });
});
