import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger'

import { description, version } from '../package.json'

import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const swaggerConfig = new DocumentBuilder()
    .setDescription(description)
    .setVersion(version)
    .setTitle('Articles - API')
    .addBearerAuth()
    .build()

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Articles-API - Documentation',
  }

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document, swaggerCustomOptions)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors()

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
