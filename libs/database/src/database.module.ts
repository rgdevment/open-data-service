import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbKey = config.get<string>('DB_NAME_ENV');
        const dbName = config.get<string>(dbKey ?? 'MYSQL_DATABASE');

        return {
          type: 'mysql',
          host: config.get<string>('MYSQL_HOST'),
          port: parseInt(config.get<string>('MYSQL_PORT') ?? '3306'),
          username: config.get<string>('MYSQL_USER'),
          password: config.get<string>('MYSQL_PASSWORD'),
          database: dbName,
          autoLoadEntities: true,
          relationLoadStrategy: 'query',

          synchronize: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
