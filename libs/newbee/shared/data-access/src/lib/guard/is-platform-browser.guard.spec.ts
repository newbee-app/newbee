import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { isPlatformBrowserGuard } from './is-platform-browser.guard';

describe('isPlatformBrowserGuard', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            component: EmptyComponent,
            canActivate: [isPlatformBrowserGuard],
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(location).toBeDefined();
  });

  it('should return true if platform is browser', async () => {
    await expect(router.navigate(['/test'])).resolves.toBeTruthy();
    expect(location.path()).toEqual('/test');
  });
});
