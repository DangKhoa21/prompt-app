import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClientType;

  constructor(private readonly options: { redisUrl: string }) {
    this.redisClient = createClient({ url: options.redisUrl });
    this.redisClient.on('error', (err) => console.error(`Redis Error: ${err}`));
  }

  async onModuleInit() {
    await this.redisClient.connect();
    console.log('Connected to Redis');
  }

  async onModuleDestroy() {
    await this.redisClient.destroy();
    console.log('Disconnected from Redis');
  }

  // cache operations
  async setCache<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (ttlSeconds) {
        await this.redisClient.setEx(key, ttlSeconds, stringValue);
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  async getCache<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T; // if not valid JSON, return as is
      }
    } catch (err) {
      console.error((err as Error).message);
      return null;
    }
  }

  async deleteCache(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }
}
