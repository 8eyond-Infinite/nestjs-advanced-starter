import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { IamModule } from './contexts/iam/iam.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule, IamModule],
  controllers: [],
})
export class AppModule {}
