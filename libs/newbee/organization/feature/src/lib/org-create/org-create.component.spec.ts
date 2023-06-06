import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import { CreateOrgComponent } from '@newbee/newbee/organization/ui';
import { testCreateOrgForm1 } from '@newbee/newbee/organization/util';
import {
  AppActions,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrgCreateComponent } from './org-create.component';

describe('OrgCreateComponent', () => {
  let component: OrgCreateComponent;
  let fixture: ComponentFixture<OrgCreateComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NavbarComponent, CreateOrgComponent],
      declarations: [OrgCreateComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('init', () => {
    it('should dispatch resetPendingActions', (done) => {
      component.ngOnInit();
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(AppActions.resetPendingActions());
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });

  describe('onCreate', () => {
    it('should dispatch createOrg', (done) => {
      component.onCreate(testCreateOrgForm1);
      store.scannedActions$.subscribe({
        next: (scannedAction) => {
          try {
            expect(scannedAction).toEqual(
              OrganizationActions.createOrg({
                createOrgForm: testCreateOrgForm1,
              })
            );
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });
    });
  });
});
