import { testBaseCreateTeamDto1 } from '@newbee/shared/data-access';
import { testCreateTeamForm1 } from '../example';
import { createTeamFormToDto } from './create-team-form-to-dto.function';

describe('createTeamFormToDto', () => {
  it('should convert a create team form to a DTO', () => {
    expect(createTeamFormToDto({})).toEqual({ name: '', slug: '' });
    expect(createTeamFormToDto({ name: null, slug: null })).toEqual({
      name: '',
      slug: '',
    });
    expect(createTeamFormToDto(testCreateTeamForm1)).toEqual(
      testBaseCreateTeamDto1
    );
  });
});
