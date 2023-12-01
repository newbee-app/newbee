import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AuthenticatorActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { EditUserComponent } from '@newbee/newbee/user/ui';
import {
  testAuthenticator1,
  testBaseUpdateUserDto1,
  testUser1,
} from '@newbee/shared/util';
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
      imports: [CommonModule, EditUserComponent],
      declarations: [UserEditComponent],
      providers: [
        provideMockStore({
          initialState: {
            auth: { user: testUser1 },
            userModule: {
              authenticators: [testAuthenticator1],
              pendingEditAuthenticator: new Map([
                [testAuthenticator1.id, false],
              ]),
              pendingDeleteAuthenticator: new Map([
                [testAuthenticator1.id, false],
              ]),
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
      component.onEdit(testBaseUpdateUserDto1);
      expect(store.dispatch).toHaveBeenCalledWith(
        UserActions.editUser({ updateUserDto: testBaseUpdateUserDto1 }),
      );
    });
  });

  describe('onAddAuthenticator', () => {
    it('should dispatch createRegistrationOptions', () => {
      component.onAddAuthenticator();
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthenticatorActions.createRegistrationOptions(),
      );
    });
  });

  describe('onEditAuthenticator', () => {
    it('should dispatch editAuthenticatorName', () => {
      component.onEditAuthenticator({
        id: testAuthenticator1.id,
        name: testAuthenticator1.name,
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthenticatorActions.editAuthenticatorName({
          id: testAuthenticator1.id,
          name: testAuthenticator1.name,
        }),
      );
    });
  });

  describe('onDeleteAuthenticator', () => {
    it('should dispatch deleteAuthenticator', () => {
      component.onDeleteAuthenticator(testAuthenticator1.id);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthenticatorActions.deleteAuthenticator({ id: testAuthenticator1.id }),
      );
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteUser', () => {
      component.onDelete();
      expect(store.dispatch).toHaveBeenCalledWith(UserActions.deleteUser());
    });
  });
});
