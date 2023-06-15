import { BaseCreateOrganizationDto } from '@newbee/shared/data-access';
import type { CreateOrgForm } from '../interface';

/**
 * Converts a CreateOrgForm into a BaseCreateOrganizationDto.
 *
 * @param createOrgForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function createOrgFormToDto(
  createOrgForm: CreateOrgForm | Partial<CreateOrgForm>
): BaseCreateOrganizationDto {
  const { name, slug } = createOrgForm;
  return { name: name ?? '', slug: slug ?? '' };
}
