import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlsModule } from './urls/urls.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, UrlsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
