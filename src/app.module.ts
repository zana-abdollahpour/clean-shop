import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoModule } from 'src/shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from 'src/shared/infrastructure/database/postgres/drizzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    DrizzleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
