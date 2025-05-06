import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorSubtypeEntity } from '../../common/entities/indicator-subtype.entity';
import { IndicatorTypeEntity } from '../../common/entities/indicator-type.entity';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { SalariesController } from './salaries.controller';
import { SalariesRepository } from './salaries.repository';
import { SalariesService } from './salaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndicatorValueEntity, IndicatorSubtypeEntity, IndicatorTypeEntity])],
  controllers: [SalariesController],
  providers: [SalariesService, SalariesRepository],
})
export class SalariesModule {}
