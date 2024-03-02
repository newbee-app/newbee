import { of } from 'rxjs';
import { ingestValue } from './ingest-value.function';

describe('ingestValue', () => {
  it('should convert values to promise', async () => {
    await expect(ingestValue(true)).resolves.toBeTruthy();
    await expect(
      ingestValue(
        new Promise((resolve) => {
          return resolve(true);
        }),
      ),
    ).resolves.toBeTruthy();
    await expect(ingestValue(of(true))).resolves.toBeTruthy();
  });
});
