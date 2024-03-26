import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import * as fs from 'fs';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly configService: ConfigService
  ){
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }
  
  async sendVerificationMail(email: string, codigo: string) {
  
    const urlVerificacion = process.env.PATH_FOR_EMAIL + codigo;
    let htmlContent = await fs.promises.readFile(process.env.PATH_FOR_HTML+'verificacion.html', 'utf-8');

    htmlContent = htmlContent.replace('URL_DE_VERIFICACION', urlVerificacion);
    
    const mail = {
      to: email,
      subject: 'Externado de San José - Verificación de correo electrónico',
      from: process.env.USER_GRID_MAILER,
      text: 'Externado de San José',
      html: htmlContent,
    };

    const transport = await SendGrid.send(mail);
    // avoid this on production. use log instead :)
    console.log(`E-Mail sent to ${mail.to}`);
    return transport;
  }

  async sendResetPassMail(email: string, pass: string) {
  
    let htmlContent = await fs.promises.readFile(process.env.PATH_FOR_HTML+'resetPass.html', 'utf-8');

    htmlContent = htmlContent.replace('NEW_PASSWORD_EXTERNADO', pass);
    htmlContent = htmlContent.replace('URL_LOGIN_EXTERNADO', process.env.PATH_FOR_RESET_PASS);
    
    const mail = {
      to: email,
      subject: 'Externado de San José - Cambio de contraseña',
      from: process.env.USER_GRID_MAILER,
      text: 'Externado de San José',
      html: htmlContent,
    };

    const transport = await SendGrid.send(mail);
    // avoid this on production. use log instead :)
    console.log(`E-Mail sent to ${mail.to}`);
    return transport;
  }

}
