import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import type { CountryCode } from 'libphonenumber-js';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { Country } from '../class';
import { SupportedLocale } from '../enum';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly regionNames: Intl.DisplayNames;

  private readonly _currentRegion: string;
  private readonly _currentCountry: Country;
  private readonly _supportedLocales: string[] = Object.values(SupportedLocale);
  private readonly _supportedRegions: string[] = Object.keys(SupportedLocale);
  private readonly _supportedPhoneRegions: string[];
  private readonly _supportedPhoneCountries: Country[];

  constructor(@Inject(LOCALE_ID) localeId: string) {
    this.regionNames = new Intl.DisplayNames(localeId, { type: 'region' });

    this._currentRegion = localeId.split('-')[1];
    this._currentCountry = this.getCountry(this._currentRegion);

    const supportedRegionsSet = new Set(this._supportedRegions);
    this._supportedPhoneRegions = this._supportedRegions.concat(
      getCountries().filter((region) => !supportedRegionsSet.has(region))
    );
    this._supportedPhoneCountries = this._supportedPhoneRegions.map((region) =>
      this.getCountry(region)
    );
  }

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

  get currentRegion(): string {
    return this._currentRegion;
  }

  get currentCountry(): Country {
    return this._currentCountry;
  }

  get supportedLocales(): string[] {
    return this._supportedLocales;
  }

  get supportedRegions(): string[] {
    return this._supportedRegions;
  }

  get supportedPhoneRegions(): string[] {
    return this._supportedPhoneRegions;
  }

  get supportedPhoneCountries(): Country[] {
    return this._supportedPhoneCountries;
  }
}
