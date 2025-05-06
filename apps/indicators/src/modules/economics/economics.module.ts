import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorSubtypeEntity } from '../../common/entities/indicator-subtype.entity';
import { IndicatorTypeEntity } from '../../common/entities/indicator-type.entity';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { EconomicsController } from './economics.controller';
import { EconomicsRepository } from './economics.repository';
import { EconomicsService } from './economics.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndicatorValueEntity, IndicatorSubtypeEntity, IndicatorTypeEntity])],
  controllers: [EconomicsController],
  providers: [EconomicsService, EconomicsRepository],
})
export class EconomicsModule {}
