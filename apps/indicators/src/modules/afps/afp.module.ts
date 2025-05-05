import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfpController } from './afp.controller';
import { AfpRepository } from './afp.repository';
import { AfpService } from './afp.service';
import { AfpCommissionCategoryEntity } from './entities/afp-commission-category.entity';
import { AfpCommissionSubcategoryEntity } from './entities/afp-commission-subcategory.entity';
import { AfpCommissionEntity } from './entities/afp-commission.entity';
import { AfpEntity } from './entities/afp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AfpEntity,
      AfpCommissionEntity,
      AfpCommissionCategoryEntity,
      AfpCommissionSubcategoryEntity,
    ]),
  ],
  controllers: [AfpController],
  providers: [AfpService, AfpRepository],
})
export class AfpModule {}
