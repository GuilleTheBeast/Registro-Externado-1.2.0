import { Controller, Post } from '@nestjs/common';
import { EmailSenderService } from './email_sender.service';

@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @Post("sendSendGrid")
  async sendVerificationMail() {

    return await  this.emailSenderService.sendVerificationMail("miguel_h24@hotmail.com", "5360808b-87b1-5ddc-8e43-ed3db3e24227");
    //return await  this.emailSenderService.sendVerificationMail("miguelh24@gmail.com", "5360808b-87b1-5ddc-8e43-ed3db3e24227");
    //return await  this.emailSenderService.sendVerificationMail("moises.reyes15@outlook.com", "5360808b-87b1-5ddc-8e43-ed3db3e24227");

  }

}
