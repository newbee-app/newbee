import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { NgUniversalInterceptor } from '@newbee/newbee/ng-universal/data-access';
import { BASE_API_URL } from '@newbee/newbee/shared/util';
import { baseApiUrl } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

/**
 * The `AppModule` prepared for SSR through Angular Universal.
 */
@NgModule({
  imports: [AppModule, ServerModule],
  providers: [
    {
      provide: BASE_API_URL,
      useValue: baseApiUrl,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgUniversalInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
