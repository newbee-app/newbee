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

  describe('getCountry', () => {
    it('should convert region codes to Country objects', () => {
      expect(service.getCountry('us')).toEqual(testCountry1);
      expect(service.getCountry('US')).toEqual(testCountry1);
    });

    it('should handle failure gracefully', () => {
      expect(service.getCountry('xx')).toEqual({
        name: 'XX',
        regionCode: 'XX',
        dialingCode: '0',
      });
    });
  });
});
