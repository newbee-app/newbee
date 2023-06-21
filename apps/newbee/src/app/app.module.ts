import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  AuthenticatorEffects,
  CookieEffects,
  RouterEffects,
  SearchEffects,
} from '@newbee/newbee/shared/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { environment, extModules } from '../environments/environment';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './interceptor';
import { reducers } from './reducer';
import { AppRoutingModule } from './routing';

/**
 * Imports all of the modules needed at the global scope.
 * Some important notes:
 *
 * - The `HttpClientModule` is imported here, so no need to re-import it in individual modules.
 * - The `AppRoutingModule` must come last.
 * - All user-created modules should be defined in `AppRoutingModule`, not here.
 */
@NgModule({
  imports: [
    // third party modules
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    EffectsModule.forRoot([
      AuthenticatorEffects,
      CookieEffects,
      RouterEffects,
      SearchEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    extModules,

    // routing module
    AppRoutingModule,
  ],
  providers: [httpInterceptorProviders],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
