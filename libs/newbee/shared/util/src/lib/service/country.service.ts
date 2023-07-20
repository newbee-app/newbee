import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { SupportedLocale } from '@newbee/shared/util';
import type { CountryCode } from 'libphonenumber-js';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { Country } from '../class';

/**
 * A global service that helps work with country values.
 */
@Injectable({ providedIn: 'root' })
export class CountryService {
  /**
   * All valid country region names.
   */
  private readonly regionNames: Intl.DisplayNames;

  private readonly _currentRegion: string;
  private readonly _currentCountry: Country;
  private readonly _supportedLocales: string[] = Object.values(SupportedLocale);
  private readonly _supportedRegions: string[] = Object.keys(SupportedLocale);
  private readonly _supportedPhoneRegions: string[];
  private readonly _supportedPhoneCountries: Country[];

  constructor(@Inject(LOCALE_ID) localeId: string) {
    this.regionNames = new Intl.DisplayNames(localeId, { type: 'region' });

    this._currentRegion = localeId.split('-')[1] ?? 'US';
    this._currentCountry = this.getCountry(this._currentRegion);

    const supportedRegionsSet = new Set(this._supportedRegions);
    this._supportedPhoneRegions = this._supportedRegions.concat(
      getCountries().filter((region) => !supportedRegionsSet.has(region))
    );
    this._supportedPhoneCountries = this._supportedPhoneRegions.map((region) =>
      this.getCountry(region)
    );
  }

  /**
   * Get the country object associated with the given region code.
   *
   * @param regionCode The region code to turn into a country object.
   * @returns The country object associated with the given region code.
   */
  getCountry(regionCode: string): Country {
    const ucRegionCode = regionCode.toUpperCase();
    const name = this.regionNames.of(ucRegionCode) ?? ucRegionCode;
    try {
      const dialingCode = getCountryCallingCode(ucRegionCode as CountryCode);
      return new Country(name, ucRegionCode, dialingCode);
    } catch (err) {
      return new Country(name, ucRegionCode, '0');
    }
  }

  /**
   * The current region, based on Angular's locale ID.
   */
  get currentRegion(): string {
    return this._currentRegion;
  }

  /**
   * The current country, based on Angular's locale ID.
   */
  get currentCountry(): Country {
    return this._currentCountry;
  }

  /**
   * All of the locales supported by NewBee.
   */
  get supportedLocales(): string[] {
    return this._supportedLocales;
  }

  /**
   * All of the regions supported by NewBee.
   */
  get supportedRegions(): string[] {
    return this._supportedRegions;
  }

  /**
   * All of the phone regions supported by NewBee.
   */
  get supportedPhoneRegions(): string[] {
    return this._supportedPhoneRegions;
  }

  /**
   * All of the country objects supported by NewBee.
   */
  get supportedPhoneCountries(): Country[] {
    return this._supportedPhoneCountries;
  }
}
