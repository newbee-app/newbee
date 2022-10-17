import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { SupportedLocale } from '../enum';
import { Country } from '../interface';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly phoneUtil = PhoneNumberUtil.getInstance();
  private readonly regionNames: Intl.DisplayNames;

  private readonly _currentRegion: string;
  private readonly _currentCountry: Country;
  private readonly _supportedLocales: string[] = Object.values(SupportedLocale);
  private readonly _supportedRegions: string[] = Object.keys(SupportedLocale);
  private readonly _supportedPhoneRegions: string[];

  constructor(@Inject(LOCALE_ID) localeId: string) {
    this.regionNames = new Intl.DisplayNames(localeId, { type: 'region' });

    this._currentRegion = localeId.split('-')[1];
    this._currentCountry = this.getCountry(this._currentRegion);

    const supportedRegionsSet = new Set(this._supportedRegions);
    this._supportedPhoneRegions = this._supportedRegions.concat(
      this.phoneUtil
        .getSupportedRegions()
        .filter((region) => !supportedRegionsSet.has(region))
    );
  }

  getCountry(regionCode: string): Country {
    const ucRegionCode = regionCode.toUpperCase();
    const name = this.regionNames.of(ucRegionCode) ?? ucRegionCode;
    const dialingCode = this.phoneUtil.getCountryCodeForRegion(ucRegionCode);

    return {
      name,
      regionCode: ucRegionCode,
      dialingCode,
    };
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
}