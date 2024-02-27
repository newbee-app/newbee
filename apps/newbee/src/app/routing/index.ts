import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import {
  canEditOrgGuard,
  orgGuard,
  orgTitleResolver,
} from '@newbee/newbee/organization/data-access';
import {
  OrgCreateComponent,
  OrgEditComponent,
  OrgHomeComponent,
  OrgRootComponent,
} from '@newbee/newbee/organization/feature';
import {
  authenticatedGuard,
  cookieGuard,
} from '@newbee/newbee/shared/data-access';
import { NotFoundErrorComponent } from '@newbee/newbee/shared/ui';
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
 */
const routes: Routes = [
  {
    path: '',
    canActivate: [cookieGuard],
    children: [
      {
        path: ShortUrl.Organization,
        children: [
          {
            path: Keyword.New,
            component: OrgCreateComponent,
            title: 'Create org',
          },
          {
            path: `:${ShortUrl.Organization}`,
            component: OrgRootComponent,
            title: orgTitleResolver,
            canActivate: [authenticatedGuard, orgGuard],
            children: [
              {
                path: ShortUrl.Team,
                loadChildren: async () => {
                  const m = await import('@newbee/newbee/team/feature');
                  return m.TeamModule;
                },
              },
              {
                path: ShortUrl.Member,
                loadChildren: async () => {
                  const m = await import('@newbee/newbee/org-member/feature');
                  return m.OrgMemberModule;
                },
              },
              {
                path: ShortUrl.Qna,
                loadChildren: async () => {
                  const m = await import('@newbee/newbee/qna/feature');
                  return m.QnaModule;
                },
              },
              {
                path: ShortUrl.Doc,
                loadChildren: async () => {
                  const m = await import('@newbee/newbee/doc/feature');
                  return m.DocModule;
                },
              },
              {
                path: Keyword.Search,
                loadChildren: async () => {
                  const m = await import('@newbee/newbee/search/feature');
                  return m.SearchModule;
                },
              },
              {
                path: Keyword.Edit,
                component: OrgEditComponent,
                canActivate: [canEditOrgGuard],
              },
              {
                path: '',
                component: OrgHomeComponent,
              },
            ],
          },
          {
            path: '',
            redirectTo: Keyword.New,
            pathMatch: 'full',
          },
        ],
      },
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
      {
        path: '**',
        component: NotFoundErrorComponent,
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
