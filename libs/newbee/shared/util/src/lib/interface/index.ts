import { Country } from '../class';

export interface PhoneInput {
  country: Country | null;
  number: string | null;
}
