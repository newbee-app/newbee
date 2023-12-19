import { PortalModule } from '@angular/cdk/portal';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  AuthenticatorEffects,
  CookieEffects,
  HeaderInterceptor,
  RouterEffects,
} from '@newbee/newbee/shared/data-access';
import {
  ErrorScreenComponent,
  NavbarComponent,
  StoreToastComponent,
} from '@newbee/newbee/shared/feature';
import { TemplateMarkerDirectiveModule } from '@newbee/newbee/shared/util';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { environment, extModules } from '../environments/environment';
import { AppComponent } from './app.component';
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
    BrowserModule,
    HttpClientModule,
    PortalModule,
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
    EffectsModule.forRoot([AuthenticatorEffects, CookieEffects, RouterEffects]),
    StoreRouterConnectingModule.forRoot(),
    extModules,

    // directive/component modules for `AppComponent`
    TemplateMarkerDirectiveModule,
    NavbarComponent,
    ErrorScreenComponent,
    StoreToastComponent,

    // routing module
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_ID,
      useValue: 'serverApp',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
