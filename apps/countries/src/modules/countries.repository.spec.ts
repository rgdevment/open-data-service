import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { SelectQueryBuilder } from 'typeorm';
import { DataSource } from 'typeorm';
import { CountriesRepository } from './countries.repository';
import type { Country } from './entities/country.entity';
import type { CountriesQueryDto } from './dto/countries-query.dto';

const mockQueryBuilder = {
  orderBy: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
};

const defaultQuery: CountriesQueryDto = {
  page: 1,
  limit: 20,
  excludeStates: false,
  excludeCities: false,
};

describe('CountriesRepository', () => {
  let repository: CountriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<CountriesRepository>(CountriesRepository);

    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<Country>);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllWithOptions', () => {
    it('should build a paginated query with all joins by default', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      await repository.findAllWithOptions(defaultQuery);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('country.states', 'states');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('states.cities', 'cities');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should build a non-paginated query if states are excluded', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await repository.findAllWithOptions({ ...defaultQuery, excludeStates: true });

      expect(mockQueryBuilder.leftJoinAndSelect).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should only join states if cities are excluded', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await repository.findAllWithOptions({ ...defaultQuery, excludeCities: true });

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('country.states', 'states');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should use default limit when limit is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, limit: undefined };
      await repository.findAllWithOptions(query);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should use default page when page is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, page: undefined };
      const result = await repository.findAllWithOptions(query);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(result.page).toBe(1);
    });
  });

  describe('findByRegion', () => {
    const region = 'Americas';

    it('should build a query with a where clause for the region', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      await repository.findByRegion(region, defaultQuery);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('country.region = :region', { region });
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should use getMany if states are excluded', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await repository.findByRegion(region, { ...defaultQuery, excludeStates: true });

      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).not.toHaveBeenCalled();
    });

    it('should use default limit when limit is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, limit: undefined };
      await repository.findByRegion(region, query);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should use default page when page is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, page: undefined };
      const result = await repository.findByRegion(region, query);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(result.page).toBe(1);
    });
  });

  describe('findBySubregion', () => {
    const subregion = 'South America';

    it('should build a query with a where clause for the subregion', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      await repository.findBySubregion(subregion, defaultQuery);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('country.subregion = :subregion', { subregion });
    });

    it('should use getMany if states are excluded', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await repository.findBySubregion(subregion, { ...defaultQuery, excludeStates: true });

      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).not.toHaveBeenCalled();
    });

    it('should use default limit when limit is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, limit: undefined };
      await repository.findBySubregion(subregion, query);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should use default page when page is not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, page: undefined };
      const result = await repository.findBySubregion(subregion, query);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(result.page).toBe(1);
    });
  });

  describe('findByCapital', () => {
    it('should build a query to find one country by capital', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const capital = 'Santiago';
      await repository.findByCapital(capital, defaultQuery);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('country.capital = :capital', { capital });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should not include joins if states are excluded', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await repository.findByCapital('Santiago', { ...defaultQuery, excludeStates: true });

      expect(mockQueryBuilder.leftJoinAndSelect).not.toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should build a query to find one country by name', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      const name = 'Chile';
      await repository.findByName(name, defaultQuery);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('country.name = :name', { name });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should build a query with multiple OR WHERE clauses', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      const term = 'arg';
      await repository.search(term, defaultQuery);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('country.code = :term OR country.code = :term', {
        term: 'ARG',
      });
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith('country.name LIKE :likeTerm', { likeTerm: `%${term}%` });
    });

    it('should be paginated only if cities are included', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      await repository.search('arg', { ...defaultQuery, excludeCities: false, page: 2, limit: 10 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should not be paginated if cities are excluded', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      await repository.search('arg', { ...defaultQuery, excludeCities: true });

      expect(mockQueryBuilder.skip).not.toHaveBeenCalled();
      expect(mockQueryBuilder.take).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should not include any joins if states are excluded', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      await repository.search('arg', { ...defaultQuery, excludeStates: true });

      expect(mockQueryBuilder.leftJoinAndSelect).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should use default pagination when page and limit are not provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query = { ...defaultQuery, page: undefined, limit: undefined };

      const result = await repository.search('arg', query);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });
});
