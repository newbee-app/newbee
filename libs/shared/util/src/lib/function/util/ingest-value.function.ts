import { Observable, lastValueFrom } from 'rxjs';

/**
 * Ingest a value which can either be itself, a promise, or an observable.
 *
 * @param value The value to ingest.
 *
 * @returns The value as a promise.
 */
export async function ingestValue<Type>(
  value: Type | Promise<Type> | Observable<Type>,
): Promise<Type> {
  if (value instanceof Observable) {
    return await lastValueFrom(value);
  }

  return await value;
}
