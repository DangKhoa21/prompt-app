import { createClient, RedisClientType } from 'redis';

export class RedisClient {
  private static instance: RedisClient;

  redisClient: RedisClientType;

  private constructor(connectionUrl: string) {
    const url = connectionUrl;
    this.redisClient = createClient({ url });
    this.redisClient.on('error', (err) => console.error(`Redis Error: ${err}`));
  }

  private async _connect(): Promise<void> {
    try {
      await this.redisClient.connect();
      console.log('Connected to redis server');
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  public static async init(connectionUrl: string) {
    if (!this.instance) {
      this.instance = new RedisClient(connectionUrl);
      await this.instance._connect();
    }
  }

  public static getInstance(): RedisClient {
    if (!this.instance) {
      throw new Error('RedisClient instance not initialized');
    }

    return this.instance;
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
    console.log('Disconnected redis server');
  }

  // cache operations
  public async setCache<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
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

  public async getCache<T>(key: string): Promise<T | null> {
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

  public async deleteCache(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}
