import { BaseUpdateOrganizationDto } from '@newbee/shared/data-access';
import { EditOrgSlugForm } from '../interface';

/**
 * Converts an EditOrgSlugForm into a BaseUpdateOrganizationDto.
 *
 * @param editOrgSlugForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function editOrgSlugFormToDto(
  editOrgSlugForm: EditOrgSlugForm | Partial<EditOrgSlugForm>
): BaseUpdateOrganizationDto {
  const { slug } = editOrgSlugForm;
  return { ...(slug && { slug }) };
}
