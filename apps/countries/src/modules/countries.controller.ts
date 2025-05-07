import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RedisCacheInterceptor } from '@libs/cache';
import { CountriesService } from './countries.service';
import { CountriesQueryDto } from './dto/countries-query.dto';
import { CountryDto } from './dto/country.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';

@ApiTags('countries')
@Controller('v1')
@UseInterceptors(RedisCacheInterceptor)
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all countries',
    description: `
Retrieves data for all countries. Optionally includes states and cities.

**Optional Query Parameters:**
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
- \`page\`, \`limit\`: Pagination
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation. Returns paginated list of countries.',
    type: CountryDto,
    isArray: true,
  })
  @ApiResponse({ status: 204, description: 'No countries found.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllCountries(@Query() query: CountriesQueryDto): Promise<PaginatedResponse<CountryDto>> {
    return this.service.getAllCountries(query);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search countries by name, code, or capital',
    description: `
Search for countries using a free-text query across the name, ISO code, or capital.

**Query Parameters:**
- \`q\` (required): Search term (e.g., "Chile", "CL", "Santiago")
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
- \`page\`, \`limit\`: Pagination settings
    `,
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: true,
    example: 'Chile',
    description: 'Search term: name, ISO code, or capital',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of countries matching the search query.',
    type: CountryDto,
    isArray: true,
  })
  @ApiResponse({ status: 204, description: 'No matching countries found.' })
  @ApiResponse({ status: 400, description: 'Query parameter "q" is missing or invalid.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async search(@Query('q') q: string, @Query() query: CountriesQueryDto): Promise<PaginatedResponse<CountryDto>> {
    return this.service.searchCountries(q, query);
  }

  @Get('region/:region')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get countries by region',
    description: `
Returns a paginated list of countries within a specified region.

**Optional Query Parameters:**
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
- \`page\`, \`limit\`: Pagination
    `,
  })
  @ApiParam({
    name: 'region',
    example: 'Americas',
    description: 'The region to filter by (e.g., "Americas", "Europe")',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of countries in the specified region.',
    type: CountryDto,
    isArray: true,
  })
  @ApiResponse({ status: 204, description: 'No countries found for this region.' })
  @ApiResponse({ status: 400, description: 'Invalid region or query parameters.' })
  @ApiResponse({ status: 500, description: 'Unexpected error.' })
  async getCountriesByRegion(
    @Param('region') region: string,
    @Query() query: CountriesQueryDto,
  ): Promise<PaginatedResponse<CountryDto>> {
    return this.service.getCountryByRegion(region, query);
  }

  @Get('subregion/:subregion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get countries by subregion',
    description: `
Returns a paginated list of countries within a specified subregion.

**Optional Query Parameters:**
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
- \`page\`, \`limit\`: Pagination
    `,
  })
  @ApiParam({
    name: 'subregion',
    example: 'Southern Europe',
    description: 'The subregion to filter by (e.g., "Southern Europe")',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of countries in the specified subregion.',
    type: CountryDto,
    isArray: true,
  })
  @ApiResponse({ status: 204, description: 'No countries found for this subregion.' })
  @ApiResponse({ status: 400, description: 'Invalid subregion.' })
  @ApiResponse({ status: 500, description: 'Unexpected error.' })
  async getCountriesBySubregion(
    @Param('subregion') subregion: string,
    @Query() query: CountriesQueryDto,
  ): Promise<PaginatedResponse<CountryDto>> {
    return this.service.getCountryBySubregion(subregion, query);
  }

  @Get('capital/:capital')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get country by capital',
    description: `
Returns a single country by its capital city.

**Optional Query Parameters:**
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
    `,
  })
  @ApiParam({
    name: 'capital',
    example: 'Santiago',
    description: 'Capital city of the country',
  })
  @ApiResponse({
    status: 200,
    description: 'Country found by capital.',
    type: CountryDto,
  })
  @ApiResponse({ status: 204, description: 'No country found for the given capital.' })
  @ApiResponse({ status: 400, description: 'Invalid capital parameter.' })
  @ApiResponse({ status: 500, description: 'Unexpected error.' })
  async getCountryByCapital(
    @Param('capital') capital: string,
    @Query() query: CountriesQueryDto,
  ): Promise<CountryDto | null> {
    return this.service.getCountryByCapital(capital, query);
  }

  @Get('country/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get country by name',
    description: `
Returns a single country by its name.

**Optional Query Parameters:**
- \`excludeStates\`, \`excludeCities\`: Control inclusion of nested data
    `,
  })
  @ApiParam({
    name: 'name',
    example: 'Spain',
    description: 'Name of the country',
  })
  @ApiResponse({
    status: 200,
    description: 'Country found by name.',
    type: CountryDto,
  })
  @ApiResponse({ status: 204, description: 'No country found for the given name.' })
  @ApiResponse({ status: 400, description: 'Invalid name parameter.' })
  @ApiResponse({ status: 500, description: 'Unexpected error.' })
  async getCountryByName(@Param('name') name: string, @Query() query: CountriesQueryDto): Promise<CountryDto | null> {
    return this.service.getCountryByName(name, query);
  }
}
