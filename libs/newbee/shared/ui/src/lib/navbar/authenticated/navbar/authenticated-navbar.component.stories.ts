import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../../testing';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    user: testUser1,
    organizations: [testOrganization1, testOrganization2],
    selectedOrganization: testOrganization1,
    orgMember: testOrgMemberRelation1,
    pastOrgHome: false,
    initialSearchTerm: '',
    searchSuggestions: [],
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    search: { action: 'search' },
    navigateToLink: { action: 'navigateToLink' },
    logout: { action: 'logout' },
  },
  parameters: { layout: 'fullscreen' },
} as Meta<AuthenticatedNavbarComponent>;

type Story = StoryObj<AuthenticatedNavbarComponent>;

export const SelectedOrg: Story = {};

export const NoSelectedOrg: Story = {
  args: { selectedOrganization: null },
};

export const pastOrgHome: Story = { args: { pastOrgHome: true } };

export const initialSearchTerm: Story = {
  args: { ...pastOrgHome.args, initialSearchTerm: 'searching' },
};

export const searchSuggestions: Story = {
  args: {
    ...initialSearchTerm.args,
    searchSuggestions: ['searching for', 'searching this', 'searching that'],
  },
};
