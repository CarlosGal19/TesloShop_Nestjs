import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { envConfiguration } from './common/config/env.config';
import { ZodEnvSchema } from './common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validate: (config) => {
        return ZodEnvSchema.parse(config);
      },
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
