import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { DataSource, Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CountriesQueryDto } from './dto/countries-query.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';

@Injectable()
export class CountriesRepository extends Repository<Country> {
  constructor(dataSource: DataSource) {
    super(Country, dataSource.createEntityManager());
  }

  private applyStateCityJoins(
    queryBuilder: SelectQueryBuilder<Country>,
    includeStates: boolean,
    includeCities: boolean,
  ): void {
    if (includeStates && includeCities) {
      queryBuilder.leftJoinAndSelect('country.states', 'states').leftJoinAndSelect('states.cities', 'cities');
    } else if (includeStates) {
      queryBuilder.leftJoinAndSelect('country.states', 'states');
    }
  }

  async findAllWithOptions(query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const limit = Math.min(query.limit ?? 20, 20);
    const offset = ((query.page ?? 1) - 1) * limit;

    const countryQuery = this.createQueryBuilder('country').orderBy('country.name', 'ASC');

    this.applyStateCityJoins(countryQuery, includeStates, includeCities);

    if (includeStates && includeCities) {
      countryQuery.take(limit).skip(offset);
      const [data, total] = await countryQuery.getManyAndCount();
      return {
        data,
        total,
        page: query.page ?? 1,
        limit,
      };
    }

    const data = await countryQuery.getMany();
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  }

  async findByRegion(region: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const limit = Math.min(query.limit ?? 20, 20);
    const offset = ((query.page ?? 1) - 1) * limit;

    const countryQuery = this.createQueryBuilder('country')
      .where('country.region = :region', { region })
      .orderBy('country.name', 'ASC');

    this.applyStateCityJoins(countryQuery, includeStates, includeCities);

    if (includeStates && includeCities) {
      countryQuery.take(limit).skip(offset);
      const [data, total] = await countryQuery.getManyAndCount();
      return {
        data,
        total,
        page: query.page ?? 1,
        limit,
      };
    }

    const data = await countryQuery.getMany();
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  }

  async findBySubregion(subregion: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const limit = Math.min(query.limit ?? 20, 20);
    const offset = ((query.page ?? 1) - 1) * limit;

    const countryQuery = this.createQueryBuilder('country')
      .where('country.subregion = :subregion', { subregion })
      .orderBy('country.name', 'ASC');

    this.applyStateCityJoins(countryQuery, includeStates, includeCities);

    if (includeStates && includeCities) {
      countryQuery.take(limit).skip(offset);
      const [data, total] = await countryQuery.getManyAndCount();
      return {
        data,
        total,
        page: query.page ?? 1,
        limit,
      };
    }

    const data = await countryQuery.getMany();
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  }

  async findByCapital(capital: string, query: CountriesQueryDto): Promise<Country | null> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const countryQuery = this.createQueryBuilder('country')
      .where('country.capital = :capital', { capital })
      .orderBy('country.name', 'ASC');

    this.applyStateCityJoins(countryQuery, includeStates, includeCities);

    return await countryQuery.getOne();
  }

  async findByName(name: string, query: CountriesQueryDto): Promise<Country | null> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const countryQuery = this.createQueryBuilder('country')
      .where('country.name = :name', { name })
      .orderBy('country.name', 'ASC');

    this.applyStateCityJoins(countryQuery, includeStates, includeCities);

    return await countryQuery.getOne();
  }

  async search(term: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    const includeStates = !query.excludeStates;
    const includeCities = !query.excludeCities;

    const queryBuilder = this.createQueryBuilder('country')
      .where('country.code = :term OR country.code = :term', { term: term.toUpperCase() })
      .orWhere('country.name LIKE :likeTerm', { likeTerm: `%${term}%` })
      .orWhere('country.region LIKE :likeTerm', { likeTerm: `%${term}%` })
      .orWhere('country.subregion LIKE :likeTerm', { likeTerm: `%${term}%` });

    if (includeStates) {
      queryBuilder.leftJoinAndSelect('country.states', 'states');
    }

    if (includeStates && includeCities) {
      queryBuilder.leftJoinAndSelect('states.cities', 'cities');
    }

    queryBuilder.orderBy('country.name', 'ASC');

    if (includeCities) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      queryBuilder.skip((page - 1) * limit).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit };
    }

    const data = await queryBuilder.getMany();
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
    };
  }
}
