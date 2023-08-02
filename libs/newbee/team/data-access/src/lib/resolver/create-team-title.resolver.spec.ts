import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { testOrganization1, testTeam1 } from '@newbee/shared/util';
import { createTeamTitleResolver } from './create-team-title.resolver';

describe('createTeamTitleResolver', () => {
  let router: Router;
  let location: Location;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            title: 'Error',
            children: [
              {
                path: 'test',
                component: EmptyComponent,
                title: createTeamTitleResolver,
              },
            ],
          },
          {
            path: '',
            title: testOrganization1.name,
            children: [
              {
                path: testTeam1.slug,
                component: EmptyComponent,
                title: createTeamTitleResolver,
              },
              {
                path: '',
                component: EmptyComponent,
              },
            ],
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    title = TestBed.inject(Title);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it('should use parent title if error detected', async () => {
    await expect(router.navigate(['/test/test'])).resolves.toBeTruthy();
    expect(location.path()).toEqual('/test/test');
    expect(title.getTitle()).toEqual('Error');
  });

  it('should add to parent title if no error detected', async () => {
    await expect(router.navigate([`/${testTeam1.slug}`])).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testTeam1.slug}`);
    expect(title.getTitle()).toEqual(`Create team - ${testOrganization1.name}`);
  });
});
