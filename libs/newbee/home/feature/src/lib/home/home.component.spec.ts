import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { NoOrgComponent, NoOrgSelectedComponent } from '@newbee/newbee/home/ui';
import { initialOrganizationState } from '@newbee/newbee/shared/data-access';
import { NavbarComponent } from '@newbee/newbee/shared/feature';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('navigateToLink', () => {
    it('should call navigate', async () => {
      await component.navigateToLink(
        `/${ShortUrl.Organization}/${Keyword.New}`
      );
      expect(router.navigate).toBeCalledTimes(1);
      expect(router.navigate).toBeCalledWith([
        `/${ShortUrl.Organization}/${Keyword.New}`,
      ]);
    });
  });
});
