import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteKeyword } from '@newbee/newbee/navbar/util';
import { UnauthenticatedActionItemsComponent } from './unauthenticated-action-items.component';

describe('UnauthenticatedActionItemsComponent', () => {
  let component: UnauthenticatedActionItemsComponent;
  let fixture: ComponentFixture<UnauthenticatedActionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [UnauthenticatedActionItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthenticatedActionItemsComponent);
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
