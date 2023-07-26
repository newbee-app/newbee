import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortUrl } from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { NoOrgComponent } from './no-org.component';

describe('NoOrgComponent', () => {
  let component: NoOrgComponent;
  let fixture: ComponentFixture<NoOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoOrgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoOrgComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('emitNavigateToLink should emit navigateToLink', () => {
    jest.spyOn(component.navigateToLink, 'emit');
    component.emitNavigateToLink(ShortUrl.Organization, Keyword.New);
    expect(component.navigateToLink.emit).toBeCalledTimes(1);
    expect(component.navigateToLink.emit).toBeCalledWith(
      `/${ShortUrl.Organization}/${Keyword.New}`
    );
  });
});
