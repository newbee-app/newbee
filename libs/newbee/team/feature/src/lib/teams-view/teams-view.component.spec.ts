import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { initialOrganizationState } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { ViewTeamsComponent } from '@newbee/newbee/team/ui';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { provideMockStore } from '@ngrx/store/testing';
import { TeamsViewComponent } from './teams-view.component';

describe('TeamsViewComponent', () => {
  let component: TeamsViewComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamsComponent],
      declarations: [TeamsViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
              orgMember: testOrgMemberRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: TeamsViewComponent }]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(
      `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}`,
      TeamsViewComponent,
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('onOrgNavigate', () => {
    it('should navigate relative to the currently selected org', async () => {
      await component.onOrgNavigate({
        route: `/${ShortUrl.Team}/${Keyword.New}`,
      });
      expect(router.url).toEqual(
        `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Team}/${Keyword.New}`,
      );
    });
  });
});
