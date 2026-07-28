import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendPasswordRequest(email: string, token: string) {

        const params = new URLSearchParams({ token });

        await this.mailerService.sendMail({
            to: email,
            subject: 'Redefinição de senha',
            template: 'forgot-password.hbs',
            context: {
                url: `http://localhost:3000/v1/auth/reset-password?${params.toString()}`
            }
        });
    }
}
