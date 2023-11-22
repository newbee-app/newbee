import { FormControl } from '@angular/forms';
import { Frequency } from '@newbee/shared/util';
import { capitalize } from 'lodash-es';
import { frequencySelectOptions } from './frequency-select-options.function';

describe('frequencySelectOptions', () => {
  it('should pluralize the displayed values based on num', () => {
    const control = new FormControl<number | null>(1);
    const frequencies = frequencySelectOptions(control);
    Object.values(Frequency).forEach((frequency, i) => {
      expect(frequencies[i]?.value).toEqual(frequency);
      expect(frequencies[i]?.dropdownValue).toEqual(
        capitalize(frequency.slice(0, -1)),
      );
      expect(frequencies[i]?.selectedValue).toEqual(
        capitalize(frequency.slice(0, -1)),
      );
    });

    control.setValue(2);
    Object.values(Frequency).forEach((frequency, i) => {
      expect(frequencies[i]?.value).toEqual(frequency);
      expect(frequencies[i]?.dropdownValue).toEqual(capitalize(frequency));
      expect(frequencies[i]?.selectedValue).toEqual(capitalize(frequency));
    });
  });
});
