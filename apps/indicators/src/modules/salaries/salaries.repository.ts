import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';

@Injectable()
export class SalariesRepository extends Repository<IndicatorValueEntity> {
  constructor(dataSource: DataSource) {
    super(IndicatorValueEntity, dataSource.createEntityManager());
  }

  async findAllSortedByDate(): Promise<IndicatorValueEntity[]> {
    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: 'SALARY_MIN' })
      .orderBy('iv.recorded_date', 'DESC')
      .getMany();
  }
}
