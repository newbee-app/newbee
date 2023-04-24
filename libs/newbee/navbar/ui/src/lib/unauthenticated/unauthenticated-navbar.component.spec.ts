import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteKeyword } from '@newbee/newbee/navbar/util';
import { UnauthenticatedActionItemComponentModule } from './action-item/unauthenticated-action-item.component';
import { UnauthenticatedNavigationComponentModule } from './navigation/unauthenticated-navigation.component';

import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

describe('UnauthenticatedNavbarComponent', () => {
  let component: UnauthenticatedNavbarComponent;
  let fixture: ComponentFixture<UnauthenticatedNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        UnauthenticatedActionItemComponentModule,
        UnauthenticatedNavigationComponentModule,
      ],
      declarations: [UnauthenticatedNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthenticatedNavbarComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.navigateToLink, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('should emit navigateToLink', () => {
    component.emitNavigateToLink(RouteKeyword.Home);
    expect(component.navigateToLink.emit).toBeCalledTimes(1);
    expect(component.navigateToLink.emit).toBeCalledWith(RouteKeyword.Home);
  });
});
