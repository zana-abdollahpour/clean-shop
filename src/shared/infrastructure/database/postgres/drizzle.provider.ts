import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { schema } from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export const DrizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDB> => {
    const connectionString = configService.getOrThrow<string>(
      'POSTGRES_DATABASE_URL',
    );

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    await db.execute(sql`SELECT 0`); // for health check
    return db;
  },
};
