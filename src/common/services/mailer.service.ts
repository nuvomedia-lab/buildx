import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail({ recipients, subject, dynamicData, templateId }: SendEmailDto) {
    const apiKey = process.env.ZEPTO_PASSWORD;
    const url = this.configService.get<string>('ZEPTO_API_URL') || 'https://api.zeptomail.com/v1.1/email/template';

    const payload = {
      from: {
        address: this.configService.get<string>('MAIL_FROM') || 'noreply@buildx.app',
        name: 'BuildX',
      },
      to: [
        {
          email_address: { address: recipients },
        },
      ],
      subject,
      template_key: templateId,
      merge_info: dynamicData || {},
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Zoho-enczapikey ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      // Optionally return response.data
      return response.data;
    } catch (error: any) {
      const err = error?.response?.data || error?.message || 'Unknown mail error';
      throw new Error(`Failed to send email: ${JSON.stringify(err)}`);
    }
  }

  // Backward-compatible helper matching previous usage signature
  async sendTemplate(params: { to: string; templateId: string; subject: string; variables: Record<string, any> }) {
    const { to, templateId, subject, variables } = params;
    return this.sendEmail({ recipients: to, subject, templateId, dynamicData: variables });
  }
}


