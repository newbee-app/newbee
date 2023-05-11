/**
 * A class for holding useful information about countries.
 */
export class Country {
  /**
   * Creates a new instance of `Country`.
   *
   * @param name The country's name (e.g. 'United States').
   * @param regionCode The country's region code (e.g. 'US').
   * @param dialingCode The country's dialing code (e.g. '1').
   */
  constructor(
    public readonly name: string,
    public readonly regionCode: string,
    public readonly dialingCode: string
  ) {}
}
