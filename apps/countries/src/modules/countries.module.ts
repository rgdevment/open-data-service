import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesRepository } from './countries.repository';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, State, City])],
  providers: [CountriesService, CountriesRepository],
  controllers: [CountriesController],
})
export class CountriesModule {}
