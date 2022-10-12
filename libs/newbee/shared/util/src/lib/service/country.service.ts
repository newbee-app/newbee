import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { SupportedLocale } from '../enum';
import { Country } from '../interface';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly phoneUtil = PhoneNumberUtil.getInstance();
  private readonly regionNames: Intl.DisplayNames;

  private readonly _localeLanguage: string;
  private readonly _localeRegion: string;
  private readonly _supportedLocales: string[] = Object.values(SupportedLocale);
  private readonly _supportedRegions: string[] = Object.keys(SupportedLocale);
  private readonly _supportedPhoneRegions: string[];

  constructor(@Inject(LOCALE_ID) localeId: string) {
    this.regionNames = new Intl.DisplayNames(localeId, { type: 'region' });

    const localeParts = localeId.split('-');
    this._localeLanguage = localeParts[0];
    this._localeRegion = localeParts[1];

    const supportedRegionsSet = new Set(this._supportedRegions);
    this._supportedPhoneRegions = this._supportedRegions.concat(
      this.phoneUtil
        .getSupportedRegions()
        .filter((region) => !supportedRegionsSet.has(region))
    );
  }

  getRegionName(regionCode: string): string {
    const ucRegionCode = regionCode.toUpperCase();
    return this.regionNames.of(ucRegionCode) ?? ucRegionCode;
  }

  getCountry(regionCode: string): Country {
    const ucRegionCode = regionCode.toUpperCase();
    const name = this.getRegionName(ucRegionCode);
    const dialingCode = this.phoneUtil.getCountryCodeForRegion(ucRegionCode);

    return {
      name,
      regionCode: ucRegionCode,
      dialingCode,
    };
  }

  get localeLanguage(): string {
    return this._localeLanguage;
  }

  get localeRegion(): string {
    return this._localeRegion;
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
