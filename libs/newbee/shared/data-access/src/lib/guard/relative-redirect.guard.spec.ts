import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { relativeRedirectGuard } from './relative-redirect.guard';

describe('relativeRedirectGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'test',
            component: EmptyComponent,
            canActivate: [relativeRedirectGuard({ route: 'test' })],
          },
          { path: '**', component: EmptyComponent },
        ]),
      ],
    });

    router = TestBed.inject(Router);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
  });

  it('should do a relative redirect', async () => {
    await expect(router.navigate(['/test'])).resolves.toBeTruthy();
    expect(router.url).toEqual('/test/test');
  });
});
