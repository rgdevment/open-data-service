import { Injectable, NotFoundException } from '@nestjs/common';
import { CountriesRepository } from './countries.repository';
import { CountriesQueryDto } from './dto/countries-query.dto';
import { Country } from './entities/country.entity';
import { PaginatedResponse } from './interfaces/pagination.interface';

@Injectable()
export class CountriesService {
  constructor(private readonly countriesRepository: CountriesRepository) {}

  async getAllCountries(query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    return this.countriesRepository.findAllWithOptions(query);
  }

  async getCountryByRegion(region: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    return this.countriesRepository.findByRegion(region, query);
  }

  async getCountryBySubregion(subregion: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    return this.countriesRepository.findBySubregion(subregion, query);
  }

  async getCountryByCapital(capital: string, query: CountriesQueryDto): Promise<Country> {
    const result = await this.countriesRepository.findByCapital(capital, query);
    if (!result) {
      throw new NotFoundException({
        message: `No country found with capital '${capital}'. Try another name or ISO code.`,
      });
    }
    return result;
  }

  async getCountryByName(name: string, query: CountriesQueryDto): Promise<Country> {
    const result = await this.countriesRepository.findByName(name, query);
    if (!result) {
      throw new NotFoundException({
        message: `No country found with name '${name}'. Try another name or ISO code.`,
      });
    }
    return result;
  }

  async searchCountries(term: string, query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    const result = await this.countriesRepository.search(term, query);

    if (!result.data.length) {
      return {
        data: [],
        total: 0,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      };
    }

    return result;
  }
}
