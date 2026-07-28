import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMAIL_QUEUE_KEY, EMAIL_SERVICE_KEY } from 'src/consts';
import { MailConsumer } from './mail.consumer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      },
      defaults: {
        from: '"Curso NestJS <no-reply@guismith.com>"'
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }
    }),
    ClientsModule.register([
      {
        name: EMAIL_SERVICE_KEY,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: EMAIL_QUEUE_KEY,
          queueOptions: { durable: true },
        }
      }
    ])
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailConsumer]
})
export class MailModule {}
