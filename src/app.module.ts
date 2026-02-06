import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { envConfiguration } from './common/config/env.config';
import { ZodEnvSchema } from './common/config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { WsGatewayModule } from './ws_gateway/ws_gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validate: (config) => {
        return ZodEnvSchema.parse(config);
      },
    }),
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || ''),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductsModule,
    SeedModule,
    FilesModule,
    AuthModule,
    WsGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
