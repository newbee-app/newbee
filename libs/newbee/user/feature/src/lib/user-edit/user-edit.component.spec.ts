import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@newbee/newbee/navbar/feature';
import {
  AuthenticatorActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { EditUserComponent } from '@newbee/newbee/user/ui';
import { testEditUserForm1 } from '@newbee/newbee/user/util';
import { testBaseUpdateUserDto1 } from '@newbee/shared/data-access';
import { testAuthenticator1, testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserEditComponent } from './user-edit.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NavbarComponent, EditUserComponent],
      declarations: [UserEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            auth: { user: testUser1 },
            userModule: {
              authenticators: [testAuthenticator1],
              pendingEditAuthenticator: [false],
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('onEdit', () => {
    it('should dispatch editUser', () => {
      component.onEdit(testEditUserForm1);
      expect(store.dispatch).toBeCalledWith(
        UserActions.editUser({ updateUserDto: testBaseUpdateUserDto1 })
      );
    });
  });

  describe('onAddAuthenticator', () => {
    it('should dispatch createRegistrationOptions', () => {
      component.onAddAuthenticator();
      expect(store.dispatch).toBeCalledWith(
        AuthenticatorActions.createRegistrationOptions()
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteUser', () => {
      component.onDelete();
      expect(store.dispatch).toBeCalledWith(UserActions.deleteUser());
    });
  });
});
