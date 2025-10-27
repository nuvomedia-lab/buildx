import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AdminMembersModule } from './adminmembers/adminmembers.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CommonModule, AuthModule, AdminMembersModule, OnboardingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
