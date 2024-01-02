import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { cookieGuard } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';

/**
 * How the web page's title should be set for all routes, unless otherwise specified.
 */
@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  /**
   * Use the title specified for the route to generate the web page's title.
   *
   * @param routerState A snapshot of the router's state.
   */
  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | NewBee`);
    }
  }
}

/**
 * All of the routes of the app.
 * Some important notes:
 *
 * - Favor lazy loading routes whenever possible.
 */
// TODO: set up a 404 not found page with a wildcard route
const routes: Routes = [
  {
    path: '',
    canActivate: [cookieGuard],
    children: [
      {
        path: Keyword.Auth,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/auth/feature');
          return m.AuthModule;
        },
      },
      {
        path: Keyword.User,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/user/feature');
          return m.UserModule;
        },
      },
      {
        path: ShortUrl.Organization,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/organization/feature');
          return m.OrganizationModule;
        },
      },
      {
        path: Keyword.Invite,
        loadChildren: async () => {
          const m = await import('@newbee/newbee/invite/feature');
          return m.InviteModule;
        },
      },
      {
        path: '',
        loadChildren: async () => {
          const m = await import('@newbee/newbee/home/feature');
          return m.HomeModule;
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
  exports: [RouterModule],
})
export class AppRoutingModule {}
