import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoModule } from 'src/shared/infrastructure/database/mongodb/mongo.module';

@Module({
  imports: [MongoModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
