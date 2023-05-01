import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ClickWrapperComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  testSelectOptionString1,
  testSelectOptionString2,
} from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchableSelectComponent,
        ClickWrapperComponent,
      ],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    userDisplayName: testUser1.displayName,
    organizations: [testSelectOptionString1, testSelectOptionString2],
    selectedOrganization: testSelectOptionString1,
    darkMode: true,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    darkModeChange: { action: 'darkModeChange' },
    navigateToLink: { action: 'navigateToLink' },
    logout: { action: 'logout' },
  },
} as Meta<AuthenticatedNavbarComponent>;

type Story = StoryObj<AuthenticatedNavbarComponent>;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `<newbee-authenticated-navbar [userDisplayName]="userDisplayName" [organizations]="organizations" [(selectedOrganization)]="selectedOrganization" [(darkMode)]="darkMode" (selectedOrganizationChange)="selectedOrganizationChange($event)" (darkModeChange)="darkModeChange($event)" (navigateToLink)="navigateToLink($event)" (logout)="logout($event)"></newbee-authenticated-navbar>`,
  }),
};
