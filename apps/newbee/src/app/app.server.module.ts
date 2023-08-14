import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { IsPlatformServerInterceptor } from '@newbee/newbee/shared/data-access';
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
      useClass: IsPlatformServerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
