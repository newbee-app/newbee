/***************************************************************************************************
 * Initialize the server environment - for example, adding DOM built-in types to the global scope.
 *
 * NOTE:
 * This import must come before any imports (direct or transitive) that rely on DOM built-ins being
 * available, such as `@angular/elements`.
 */
import '@angular/platform-server/init';

/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';

import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

// Needed to share cookies between the browser and server for SSR
// Otherwise, it will cause flickering when authenticated
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as xhr2 from 'xhr2';
xhr2.prototype._restrictedHeaders = {};

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
