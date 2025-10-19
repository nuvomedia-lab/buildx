import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HelloResponseDto } from './dto/hello-response.dto';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
