import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from '@newbee/newbee/shared/data-access';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true,
  },
];
