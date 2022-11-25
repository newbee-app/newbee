import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newbee-magic-link-login',
  template: '',
})
export class MagicLinkLoginComponent {
  constructor(store: Store, route: ActivatedRouteSnapshot) {
    const token = route.queryParamMap.get('token') as string;
    store.dispatch(AuthActions.confirmMagicLink({ token }));
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MagicLinkLoginComponent],
  exports: [MagicLinkLoginComponent],
})
export class MagicLinkLoginComponentModule {}
