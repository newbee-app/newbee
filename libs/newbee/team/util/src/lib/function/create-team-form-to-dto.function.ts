import { BaseCreateTeamDto } from '@newbee/shared/data-access';
import type { CreateTeamForm } from '../interface';

/**
 * Converts a CreateTeamForm into a BaseCreateTeamDto.
 *
 * @param createTeamForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function createTeamFormToDto(
  createTeamForm: CreateTeamForm | Partial<CreateTeamForm>
): BaseCreateTeamDto {
  const { name, slug } = createTeamForm;
  return { name: name ?? '', slug: slug ?? '' };
}
