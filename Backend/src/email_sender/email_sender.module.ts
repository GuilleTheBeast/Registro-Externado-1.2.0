import { Module } from '@nestjs/common';
import { EmailSenderService } from './email_sender.service';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderController } from './email_sender.controller';

@Module({
  imports:[
    ConfigModule.forRoot(),
  ],
  controllers: [EmailSenderController],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
