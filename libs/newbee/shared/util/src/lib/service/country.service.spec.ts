import { TestBed } from '@angular/core/testing';
import { testCountry1 } from '../example';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService],
    });

    service = TestBed.inject(CountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRegionName', () => {
    it('should convert region codes to names', () => {
      expect(service.getRegionName('us')).toEqual('United States');
      expect(service.getRegionName('US')).toEqual('United States');
    });
  });

  describe('getCountry', () => {
    it('should convert region codes to Country objects', () => {
      expect(service.getCountry('us')).toEqual(testCountry1);
      expect(service.getCountry('US')).toEqual(testCountry1);
    });
  });
});
