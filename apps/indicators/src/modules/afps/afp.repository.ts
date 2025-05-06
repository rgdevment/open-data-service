import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AfpCommissionEntity } from './entities/afp-commission.entity';
import { AfpEnum } from './enums/afp.enum';

@Injectable()
export class AfpRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findLatestAfp(afp: AfpEnum): Promise<AfpCommissionEntity[]> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const subQuery = this.dataSource
      .createQueryBuilder()
      .select('MAX(inner_ac.recorded_date)', 'latest')
      .addSelect('inner_ac.category_id', 'category_id')
      .addSelect('inner_ac.subcategory_id', 'subcategory_id')
      .from(AfpCommissionEntity, 'inner_ac')
      .innerJoin('inner_ac.afp', 'afp')
      .where('afp.name = :afpName', { afpName: afp })
      .andWhere('MONTH(inner_ac.recorded_date) = :currentMonth', { currentMonth })
      .andWhere('YEAR(inner_ac.recorded_date) = :currentYear', { currentYear })
      .groupBy('inner_ac.category_id, inner_ac.subcategory_id');

    const subQuerySql = subQuery.getQuery();
    const subQueryParams = subQuery.getParameters();

    const mainQuery = this.dataSource
      .getRepository(AfpCommissionEntity)
      .createQueryBuilder('ac')
      .innerJoinAndSelect('ac.afp', 'afp')
      .innerJoinAndSelect('ac.category', 'category')
      .innerJoinAndSelect('ac.subcategory', 'subcategory')
      .innerJoin(
        `(${subQuerySql})`,
        'latest_commissions',
        'ac.category_id = latest_commissions.category_id ' +
          'AND ac.subcategory_id = latest_commissions.subcategory_id ' +
          'AND ac.recorded_date = latest_commissions.latest',
      )
      .where('afp.name = :afpName', { afpName: afp })
      .setParameters(subQueryParams)
      .orderBy('category.code', 'ASC')
      .addOrderBy('subcategory.code', 'ASC');

    return await mainQuery.getMany();
  }
}
