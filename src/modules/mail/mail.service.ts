import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMAIL_SERVICE_KEY, SEND_PASSOWRD_RESET_KEY } from 'src/consts';

@Injectable()
export class MailService {
    constructor(@Inject(EMAIL_SERVICE_KEY) private client: ClientProxy) {}

    async sendPasswordRequest(email: string, token: string) {
        
        const params = new URLSearchParams({ token });
        
        const url = `http://localhost:3000/v1/auth/reset-password?${params.toString()}`;

        this.client.emit(SEND_PASSOWRD_RESET_KEY, { email, url });
    }
}
