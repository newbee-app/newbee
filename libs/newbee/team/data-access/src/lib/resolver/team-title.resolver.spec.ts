import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialHttpState,
  initialTeamState,
  ShortUrl,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  forbiddenError,
  Keyword,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { teamTitleResolver } from './team-title.resolver';

describe('teamTitleResolver', () => {
  let router: Router;
  let store: MockStore;
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
                path: `:${ShortUrl.Team}`,
                component: EmptyComponent,
                title: teamTitleResolver,
              },
            ],
          },
          {
            path: '',
            title: 'NewBee',
            children: [
              {
                path: `:${ShortUrl.Team}`,
                component: EmptyComponent,
                title: teamTitleResolver,
              },
              {
                path: '',
                component: EmptyComponent,
              },
            ],
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Team]: {
              ...initialTeamState,
              selectedTeam: testTeamRelation1,
            },
          },
        }),
      ],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    title = TestBed.inject(Title);

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it('should use parent title if error detected', async () => {
    await expect(
      router.navigate([`/test/${testTeam1.slug}`])
    ).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/test/${testTeam1.slug}`);
    expect(title.getTitle()).toEqual('Error');
  });

  it(`should set title to team's name appended to existing title if store has selected team`, async () => {
    await expect(router.navigate([`/${testTeam1.slug}`])).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testTeam1.slug}`);
    expect(title.getTitle()).toEqual(`${testTeam1.name} - NewBee`);
  });

  it(`should set title to Error appended to existing title if store has error instead of selected team`, async () => {
    store.setState({
      http: {
        ...initialHttpState,
        screenError: { status: 403, message: forbiddenError },
      },
    });
    await expect(router.navigate([`/${testTeam1.slug}`])).resolves.toBeTruthy();
    expect(location.path()).toEqual(`/${testTeam1.slug}`);
    expect(title.getTitle()).toEqual('Error - NewBee');
  });
});
