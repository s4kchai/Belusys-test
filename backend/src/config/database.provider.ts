import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => ({
    type: 'mysql',
    host: config.get<string>('DATABASE_HOST'),
    port: parseInt(config.get<string>('DATABASE_PORT') ?? '11320', 10),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),
    entities: [__dirname + '/../entities/*.entity.{js,ts}'],
    synchronize: false,
  }),
  inject: [ConfigService],
};
