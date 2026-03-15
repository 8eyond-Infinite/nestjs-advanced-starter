import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is missing in .env');
    }

    const dbConfig: PoolConfig = {
      connectionString,
    };

    const pool = new Pool(dbConfig);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const adapter = new PrismaPg(pool) as any;

    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      adapter: adapter,
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(
        '✅ Forge OS: Database connected with PostgreSQL Adapter',
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`💥 Database connection failed: ${message}`);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
