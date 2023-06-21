import {
  HttpActions,
  OrganizationActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { testOrganization1 } from '@newbee/shared/util';
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
  const stateAfterEditOrg: OrganizationState = {
    ...initialOrganizationState,
    pendingEdit: true,
  };
  const stateAfterEditOrgSlug: OrganizationState = {
    ...initialOrganizationState,
    pendingEditSlug: true,
  };
  const stateAfterDeleteOrg: OrganizationState = {
    ...initialOrganizationState,
    pendingDelete: true,
  };
  const stateAfterCheckSlug: OrganizationState = {
    ...initialOrganizationState,
    pendingCheck: true,
  };
  const stateAfterCheckSlugSuccess: OrganizationState = {
    ...initialOrganizationState,
    slugTaken: true,
  };
  const stateAfterGenerateSlugSuccess: OrganizationState = {
    ...initialOrganizationState,
    generatedSlug: testOrganization1.slug,
  };

  describe('start from initial state', () => {
    it('should update state for createOrg', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.createOrg
      );
      expect(updatedState).toEqual(stateAfterCreateOrg);
    });

    it('should update state for editOrg', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.editOrg
      );
      expect(updatedState).toEqual(stateAfterEditOrg);
    });

    it('should update state for editOrgSlug', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.editOrgSlug
      );
      expect(updatedState).toEqual(stateAfterEditOrgSlug);
    });

    it('should update state for deleteOrg', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.deleteOrg
      );
      expect(updatedState).toEqual(stateAfterDeleteOrg);
    });

    it('should update state for typingSlug if slug is not empty string', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.typingSlug({ slug: testOrganization1.slug })
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);
    });

    it('should update state for checkSlug if slug is not empty string', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.checkSlug({ slug: testOrganization1.slug })
      );
      expect(updatedState).toEqual(stateAfterCheckSlug);
    });

    it('should not update state for checkSlug if slug is empty string', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.checkSlug({ slug: '' })
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });

    it('should update state for generateSlugSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.generateSlugSuccess({
          slug: testOrganization1.slug,
        })
      );
      expect(updatedState).toEqual(stateAfterGenerateSlugSuccess);
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

    it('should update state for routerRequest', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterCreateOrg,
        RouterActions.routerRequest()
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });
  });

  describe('start from edit org', () => {
    it('should update state for editOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterEditOrg,
        OrganizationActions.editOrgSuccess
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });
  });

  describe('start from delete org', () => {
    it('should update state for deleteOrgSuccess', () => {
      const updatedState = organizationFeature.reducer(
        stateAfterDeleteOrg,
        OrganizationActions.deleteOrgSuccess
      );
      expect(updatedState).toEqual(initialOrganizationState);
    });
  });

  describe('start from check slug', () => {
    it('should update state for checkSlugSuccess', () => {
      const updatedState = organizationFeature.reducer(
        initialOrganizationState,
        OrganizationActions.checkSlugSuccess({ slugTaken: true })
      );
      expect(updatedState).toEqual(stateAfterCheckSlugSuccess);
    });
  });
});
