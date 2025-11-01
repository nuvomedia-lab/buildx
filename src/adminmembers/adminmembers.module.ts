import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminMembersService } from './adminmembers.service';
import { AdminMembersController } from './adminmembers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret_change_me',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminMembersController],
  providers: [AdminMembersService, JwtAuthGuard, RolesGuard],
  exports: [AdminMembersService],
})
export class AdminMembersModule {}

