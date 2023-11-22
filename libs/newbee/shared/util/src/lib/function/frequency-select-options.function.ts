import { AbstractControl } from '@angular/forms';
import { Frequency } from '@newbee/shared/util';
import { capitalize } from 'lodash-es';
import { SelectOption } from '../class';

/**
 * Generates the Frequency enum as select options, varying the displayed string to be plural based on the provided `num`.
 *
 * @param num Used to determine whether the displayed string should be plural.
 *
 * @returns The Frequency enum as select options.
 */
export function frequencySelectOptions(
  num: AbstractControl<number | null>,
): SelectOption<Frequency>[] {
  return Object.values(Frequency).map(
    (frequency) =>
      new SelectOption(frequency, () => {
        if (num.value === 1) {
          return capitalize(frequency.slice(0, -1));
        }

        return capitalize(frequency);
      }),
  );
}
