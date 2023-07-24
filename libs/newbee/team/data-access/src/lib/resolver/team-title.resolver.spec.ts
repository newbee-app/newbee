import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  initialHttpState,
  initialTeamState,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { UrlEndpoint } from '@newbee/shared/data-access';
import {
  forbiddenError,
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
            path: '',
            title: 'NewBee',
            component: EmptyComponent,
            children: [
              {
                path: `:${UrlEndpoint.Team}`,
                title: teamTitleResolver,
                component: EmptyComponent,
              },
            ],
          },
        ]),
      ],
      providers: [provideMockStore()],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    title = TestBed.inject(Title);

    jest.spyOn(store, 'dispatch');

    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(router).toBeDefined();
    expect(store).toBeDefined();
    expect(location).toBeDefined();
    expect(title).toBeDefined();
  });

  it(`should dispatch getTeam and set title to team's name appended to existing title`, async () => {
    store.setState({
      team: {
        ...initialTeamState,
        selectedTeam: testTeamRelation1,
      },
    });
    await expect(router.navigate([`/${testTeam1.slug}`])).resolves.toBeTruthy();
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(
      TeamActions.getTeam({ slug: testTeam1.slug })
    );
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
