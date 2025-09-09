import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), CacheModule.register({
    isGlobal: true
  }), ScheduleModule.forRoot(), PrismaModule, UrlShortenerModule, UsersModule],
})
export class AppModule {}
