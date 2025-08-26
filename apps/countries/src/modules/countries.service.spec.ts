import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesRepository } from './countries.repository';
import type { CountriesQueryDto } from './dto/countries-query.dto';

const mockCountriesRepository = {
  findAllWithOptions: jest.fn(),
  findByRegion: jest.fn(),
  findBySubregion: jest.fn(),
  findByCapital: jest.fn(),
  findByName: jest.fn(),
  search: jest.fn(),
};

const mockQueryDto: CountriesQueryDto = {
  page: 1,
  limit: 20,
  excludeStates: false,
  excludeCities: false,
};

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: CountriesRepository,
          useValue: mockCountriesRepository,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    repository = module.get<CountriesRepository>(CountriesRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('should call repository.findAllWithOptions', async () => {
      await service.getAllCountries(mockQueryDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findAllWithOptions).toHaveBeenCalledWith(mockQueryDto);
    });
  });

  describe('getCountryByRegion', () => {
    it('should call repository.findByRegion', async () => {
      const region = 'Americas';
      await service.getCountryByRegion(region, mockQueryDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findByRegion).toHaveBeenCalledWith(region, mockQueryDto);
    });
  });

  describe('getCountryBySubregion', () => {
    it('should call repository.findBySubregion', async () => {
      const subregion = 'South America';
      await service.getCountryBySubregion(subregion, mockQueryDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findBySubregion).toHaveBeenCalledWith(subregion, mockQueryDto);
    });
  });

  describe('getCountryByCapital', () => {
    it('should return a country if found', async () => {
      const mockCountry = { name: 'Chile' };
      mockCountriesRepository.findByCapital.mockResolvedValue(mockCountry);
      const result = await service.getCountryByCapital('Santiago', mockQueryDto);
      expect(result).toEqual(mockCountry);
    });

    it('should throw NotFoundException if no country is found', async () => {
      mockCountriesRepository.findByCapital.mockResolvedValue(null);
      await expect(service.getCountryByCapital('NotFound', mockQueryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCountryByName', () => {
    it('should return a country if found', async () => {
      const mockCountry = { name: 'Chile' };
      mockCountriesRepository.findByName.mockResolvedValue(mockCountry);
      const result = await service.getCountryByName('Chile', mockQueryDto);
      expect(result).toEqual(mockCountry);
    });

    it('should throw NotFoundException if no country is found', async () => {
      mockCountriesRepository.findByName.mockResolvedValue(null);
      await expect(service.getCountryByName('NotFound', mockQueryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchCountries', () => {
    it('should return the repository result if data is found', async () => {
      const mockResult = { data: [{ name: 'Argentina' }], total: 1 };
      mockCountriesRepository.search.mockResolvedValue(mockResult);
      const result = await service.searchCountries('arg', mockQueryDto);
      expect(result).toEqual(mockResult);
    });

    it('should return an empty paginated response if no data is found', async () => {
      const mockResult = { data: [], total: 0 };
      mockCountriesRepository.search.mockResolvedValue(mockResult);
      const result = await service.searchCountries('xyz', mockQueryDto);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should return a default paginated response if no data is found and no page/limit are provided', async () => {
      const mockResult = { data: [], total: 0 };
      mockCountriesRepository.search.mockResolvedValue(mockResult);

      const queryWithoutPagination = { ...mockQueryDto, page: undefined, limit: undefined };

      const result = await service.searchCountries('xyz', queryWithoutPagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });
});
