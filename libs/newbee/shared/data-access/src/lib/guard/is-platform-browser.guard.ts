import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';

/**
 * A guard that returns true if the platform is a browser.
 *
 * @returns `true` if the platform is a browser, `false` otherwise.
 */
export const isPlatformBrowserGuard: CanActivateFn = (): boolean => {
  const platformId = inject(PLATFORM_ID);
  return isPlatformBrowser(platformId);
};
