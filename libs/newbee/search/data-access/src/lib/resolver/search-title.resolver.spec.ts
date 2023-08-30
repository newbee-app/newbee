import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { Keyword } from '@newbee/shared/util';
import { searchTitleResolver } from './search-title.resolver';

describe('searchTitleResolver', () => {
  let router: Router;
  let location: Location;
  let title: Title;

  const testQuery = 'i am searching';
  const encodedTestQuery = encodeURIComponent(testQuery);

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
                path: `:${Keyword.Search}`,
                component: EmptyComponent,
                title: searchTitleResolver,
              },
            ],
          },
          {
            path: '',
            title: 'NewBee',
            children: [
              {
                path: `:${Keyword.Search}`,
                component: EmptyComponent,
                title: searchTitleResolver,
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
    await expect(router.navigate([`/test/${testQuery}`])).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/test/${encodedTestQuery}`);
    expect(title.getTitle()).toEqual('Error');
  });

  it('should title to the query if no error', async () => {
    await expect(router.navigate([`/${testQuery}`])).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${encodedTestQuery}`);
    expect(title.getTitle()).toEqual(`${testQuery} - NewBee`);
  });
});
