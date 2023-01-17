import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

describe('UnauthenticatedNavbarComponent', () => {
  let component: UnauthenticatedNavbarComponent;
  let fixture: ComponentFixture<UnauthenticatedNavbarComponent>;
  const testLinks = ['features', 'guides', 'pricing'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnauthenticatedNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthenticatedNavbarComponent);
    component = fixture.componentInstance;

    component.links = testLinks;
    jest.spyOn(component.navigateToLink, 'emit');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('should initialize inputs properly', () => {
    expect(component.links).toEqual(testLinks);
  });

  it('should emit navigateToLink', () => {
    component.emitNavigateToLink('hello');
    expect(component.navigateToLink.emit).toBeCalledTimes(1);
    expect(component.navigateToLink.emit).toBeCalledWith('hello');
  });
});
