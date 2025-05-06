import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { RedisCacheInterceptor } from 'libs/cache/src/cache.interceptor';
import { CountriesService } from './countries.service';
import { CountriesQueryDto } from './dto/countries-query.dto';
import { Country } from './entities/country.entity';
import { PaginatedResponse } from './interfaces/pagination.interface';

@Controller('v1')
@UseInterceptors(RedisCacheInterceptor)
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get('search')
  async search(@Query('q') q: string, @Query() query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    return this.service.searchCountries(q, query);
  }

  @Get()
  async getAllCountries(@Query() query: CountriesQueryDto): Promise<PaginatedResponse<Country>> {
    return this.service.getAllCountries(query);
  }

  @Get('region/:region')
  async getCountriesByRegion(
    @Param('region') region: string,
    @Query() query: CountriesQueryDto,
  ): Promise<PaginatedResponse<Country>> {
    return this.service.getCountryByRegion(region, query);
  }

  @Get('subregion/:subregion')
  async getCountriesBySubregion(
    @Param('subregion') subregion: string,
    @Query() query: CountriesQueryDto,
  ): Promise<PaginatedResponse<Country>> {
    return this.service.getCountryBySubregion(subregion, query);
  }

  @Get('capital/:capital')
  async getCountryByCapital(
    @Param('capital') capital: string,
    @Query() query: CountriesQueryDto,
  ): Promise<Country | null> {
    return this.service.getCountryByCapital(capital, query);
  }

  @Get('country/:name')
  async getCountryByName(@Param('name') name: string, @Query() query: CountriesQueryDto): Promise<Country | null> {
    return this.service.getCountryByName(name, query);
  }
}
