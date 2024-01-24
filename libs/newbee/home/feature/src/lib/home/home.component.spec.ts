import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NoOrgComponent, NoOrgSelectedComponent } from '@newbee/newbee/home/ui';
import { initialOrganizationState } from '@newbee/newbee/shared/data-access';
import { NavbarComponent } from '@newbee/newbee/shared/feature';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NavbarComponent,
        NoOrgComponent,
        NoOrgSelectedComponent,
      ],
      declarations: [HomeComponent],
      providers: [
        provideMockStore({
          initialState: { org: initialOrganizationState },
        }),
        provideRouter([{ path: '**', component: HomeComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', HomeComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('navigateToLink', () => {
    it('should call navigate', async () => {
      await component.navigateToLink({
        route: `/${ShortUrl.Organization}/${Keyword.New}`,
      });
      expect(router.url).toEqual(`/${ShortUrl.Organization}/${Keyword.New}`);
    });
  });
});
