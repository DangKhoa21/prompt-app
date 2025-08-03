import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(options: { redisUrl: string }): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisService,
          useFactory: () => new RedisService(options),
        },
      ],
      exports: [RedisService],
    };
  }
}
