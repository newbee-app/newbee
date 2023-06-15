import { testOrganization1 } from '@newbee/shared/util';
import { editOrgFormToDto } from './edit-org-form-to-dto.function';

describe('editOrgFormToDto', () => {
  it('should convert an edit org form to a DTO', () => {
    expect(editOrgFormToDto({})).toEqual({});
    expect(editOrgFormToDto({ name: null })).toEqual({});
    expect(editOrgFormToDto({ name: '' })).toEqual({});
    expect(editOrgFormToDto({ name: testOrganization1.name })).toEqual({
      name: testOrganization1.name,
    });
  });
});
