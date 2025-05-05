import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { EconomicsEnum } from './enums/economics.enum';

@Injectable()
export class EconomicsRepository extends Repository<IndicatorValueEntity> {
  constructor(dataSource: DataSource) {
    super(IndicatorValueEntity, dataSource.createEntityManager());
  }

  async findCurrentOrLastDayRecord(indicator: EconomicsEnum): Promise<IndicatorValueEntity | null> {
    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date <= CURDATE()')
      .orderBy('iv.recorded_date', 'DESC')
      .getOne();
  }

  async findFirstRecordOfMonth(indicator: EconomicsEnum, date: Date): Promise<IndicatorValueEntity | null> {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));

    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', { start, end })
      .orderBy('iv.recorded_date', 'ASC')
      .getOne();
  }

  async findLastRecordOfMonth(indicator: EconomicsEnum, date: Date): Promise<IndicatorValueEntity | null> {
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date <= :end', { end })
      .orderBy('iv.recorded_date', 'DESC')
      .getOne();
  }

  async calculateAverageValueOfMonth(indicator: EconomicsEnum, date: Date): Promise<number | null> {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));

    const result = await this.createQueryBuilder('iv')
      .leftJoin('iv.subtype', 'subtype')
      .leftJoin('subtype.type', 'type')
      .select('AVG(iv.value)', 'avg')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', { start, end })
      .getRawOne<{ avg: string }>();

    return result?.avg ? parseFloat(parseFloat(result.avg).toFixed(2)) : null;
  }

  async calculateAccumulatedValueLast12Months(indicator: EconomicsEnum): Promise<number | null> {
    const now = new Date();
    const lastYear = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1));
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));

    const result = await this.createQueryBuilder('iv')
      .leftJoin('iv.subtype', 'subtype')
      .leftJoin('subtype.type', 'type')
      .select('SUM(iv.value)', 'sum')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', {
        start: lastYear,
        end: thisMonth,
      })
      .getRawOne<{ sum: string }>();

    return result?.sum ? parseFloat(parseFloat(result.sum).toFixed(2)) : null;
  }

  async calculateYearlyAccumulatedValue(indicator: EconomicsEnum): Promise<number | null> {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), 11, 31));

    const result = await this.createQueryBuilder('iv')
      .leftJoin('iv.subtype', 'subtype')
      .leftJoin('subtype.type', 'type')
      .select('SUM(iv.value)', 'sum')
      .where('type.code = :code', { code: indicator })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', { start, end })
      .getRawOne<{ sum: string }>();

    return result?.sum ? parseFloat(parseFloat(result.sum).toFixed(2)) : null;
  }
}
