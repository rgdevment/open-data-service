import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { CurrenciesEnum } from './enums/currencies.enum';

@Injectable()
export class CurrenciesRepository extends Repository<IndicatorValueEntity> {
  constructor(dataSource: DataSource) {
    super(IndicatorValueEntity, dataSource.createEntityManager());
  }

  async findCurrentOrLastDayRecord(currency: CurrenciesEnum): Promise<IndicatorValueEntity | null> {
    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: currency })
      .andWhere('iv.recorded_date <= CURDATE()')
      .orderBy('iv.recorded_date', 'DESC')
      .getOne();
  }

  async findFirstRecordOfMonth(currency: CurrenciesEnum, date: Date): Promise<IndicatorValueEntity | null> {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0));

    return this.createQueryBuilder('iv')
      .leftJoinAndSelect('iv.subtype', 'subtype')
      .leftJoinAndSelect('subtype.type', 'type')
      .where('type.code = :code', { code: currency })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', { start, end })
      .orderBy('iv.recorded_date', 'ASC')
      .getOne();
  }

  async calculateAverageValueOfMonth(currency: CurrenciesEnum, date: Date): Promise<number | null> {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0));

    const result = await this.createQueryBuilder('iv')
      .leftJoin('iv.subtype', 'subtype')
      .leftJoin('subtype.type', 'type')
      .select('AVG(iv.value)', 'avg')
      .where('type.code = :code', { code: currency })
      .andWhere('iv.recorded_date BETWEEN :start AND :end', { start, end })
      .getRawOne<{ avg: string }>();

    return result?.avg ? parseFloat(parseFloat(result.avg).toFixed(2)) : null;
  }
}
