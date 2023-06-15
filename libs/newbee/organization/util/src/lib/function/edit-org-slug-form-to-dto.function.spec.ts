import { testOrganization1 } from '@newbee/shared/util';
import { editOrgSlugFormToDto } from './edit-org-slug-form-to-dto.function';

describe('editOrgSlugFormToDto', () => {
  it('should convert an edit org slug form to a DTO', () => {
    expect(editOrgSlugFormToDto({})).toEqual({});
    expect(editOrgSlugFormToDto({ slug: null })).toEqual({});
    expect(editOrgSlugFormToDto({ slug: '' })).toEqual({});
    expect(editOrgSlugFormToDto({ slug: testOrganization1.slug })).toEqual({
      slug: testOrganization1.slug,
    });
  });
});
