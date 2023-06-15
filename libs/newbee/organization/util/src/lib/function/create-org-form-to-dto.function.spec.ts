import { testBaseCreateOrganizationDto1 } from '@newbee/shared/data-access';
import { testCreateOrgForm1 } from '../example';
import { createOrgFormToDto } from './create-org-form-to-dto.function';

describe('createOrgFormToDto', () => {
  it('should convert a create org form to a DTO', () => {
    expect(createOrgFormToDto({})).toEqual({ name: '', slug: '' });
    expect(createOrgFormToDto({ name: null, slug: null })).toEqual({
      name: '',
      slug: '',
    });
    expect(createOrgFormToDto(testCreateOrgForm1)).toEqual(
      testBaseCreateOrganizationDto1
    );
  });
});
