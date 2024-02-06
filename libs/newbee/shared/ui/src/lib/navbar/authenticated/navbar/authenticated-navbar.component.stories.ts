import {
  OrgRoleEnum,
  testOrganization1,
  testOrganization2,
  testOrgMember1,
  testUser1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../../util';
import { AuthenticatedNavbarComponent } from './authenticated-navbar.component';

export default {
  title: 'Navbar/AuthenticatedNavbarComponent',
  component: AuthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    user: testUser1,
    organizations: [testOrganization1, testOrganization2],
    selectedOrganization: testOrganization1,
    orgMember: testOrgMember1,
    includeCenter: false,
  },
  argTypes: {
    selectedOrganizationChange: { action: 'selectedOrganizationChange' },
    navigateToLink: { action: 'navigateToLink' },
    logout: { action: 'logout' },
  },
  parameters: { layout: 'fullscreen' },
} as Meta<AuthenticatedNavbarComponent>;

type Story = StoryObj<AuthenticatedNavbarComponent>;

export const SelectedOrg: Story = {};

export const NoSelectedOrg: Story = {
  args: { selectedOrganization: null, orgMember: null },
};

export const IncludeCenter: Story = { args: { includeCenter: true } };

export const Member: Story = {
  args: {
    orgMember: { ...testOrgMember1, slug: 'bad', role: OrgRoleEnum.Member },
  },
};
