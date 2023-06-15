import { BaseUpdateOrganizationDto } from '@newbee/shared/data-access';
import type { EditOrgForm } from '../interface';

/**
 * Converts an EditOrgForm into a BaseUpdateOrganizationDto.
 *
 * @param editOrgForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function editOrgFormToDto(
  editOrgForm: EditOrgForm | Partial<EditOrgForm>
): BaseUpdateOrganizationDto {
  const { name } = editOrgForm;
  return { ...(name && { name }) };
}
