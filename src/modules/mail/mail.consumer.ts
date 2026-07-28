import { MailerService } from "@nestjs-modules/mailer";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { SEND_PASSOWRD_RESET_KEY } from "src/consts";

@Controller()
export class MailConsumer {
    constructor(private mailer: MailerService) {}

    @EventPattern(SEND_PASSOWRD_RESET_KEY)
    async handlePasswordReset(@Payload() data: { email: string, url: string }) {
        await this.mailer.sendMail({
            to: data.email,
            subject: 'Redefinição de senha',
            template: 'forgot-password.hbs',
            context: { url: data.url }
        });
    }
}
