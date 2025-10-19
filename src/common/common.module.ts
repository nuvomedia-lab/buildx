import { Global, Module } from '@nestjs/common';
import { ResponseService } from './services/response.service';
import { MailerService } from './services/mailer.service';

@Global()
@Module({
  providers: [ResponseService, MailerService],
  exports: [ResponseService, MailerService],
})
export class CommonModule {}
