import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EMAIL_QUEUE_KEY } from './consts'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Versionamento
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Curso NestJS - Tasks API')
    .setDescription('API desenvolvida durante o curso de NestJS - Monaro Dev')
    .setVersion('1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header'
    }, 'jwt')
    .addSecurityRequirements('jwt')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  // Habilitando microserviços
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: EMAIL_QUEUE_KEY,
      queueOptions: { durable: true },
    }
  });

  await app.startAllMicroservices();

  // Validações
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
