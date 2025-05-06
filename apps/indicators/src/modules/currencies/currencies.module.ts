import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorSubtypeEntity } from '../../common/entities/indicator-subtype.entity';
import { IndicatorTypeEntity } from '../../common/entities/indicator-type.entity';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesRepository } from './currencies.repository';
import { CurrenciesService } from './currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndicatorValueEntity, IndicatorSubtypeEntity, IndicatorTypeEntity])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrenciesRepository],
})
export class CurrenciesModule {}
