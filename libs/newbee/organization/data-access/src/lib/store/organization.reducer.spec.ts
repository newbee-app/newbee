import {
  HttpActions,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import {
  initialOrganizationState,
  organizationFeature,
  OrganizationState,
} from './organization.reducer';

describe('OrganizationReducer', () => {
  const stateAfterCreateOrg: OrganizationState = {
    ...initialOrganizationState,
    pendingCreate: true,
  };

  describe('start from initial state', () => {
    it('should update state for createOrg', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.createOrg
      );
      expect(updatedState).toEqual(stateAfterCreateOrg);
    });
  });

  describe('start from create org', () => {
    it('should update state for createOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterCreateOrg,
        OrganizationActions.createOrgSuccess
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });

    it('should update state for clientError', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterCreateOrg,
        HttpActions.clientError
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });

    it('should update state for orgCreateComponentInit', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterCreateOrg,
        OrganizationActions.orgCreateComponentInit
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });
  });
});
