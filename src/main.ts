import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwaggerConfig } from './swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger setup
  const { endpoint, documentConfig } = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup(endpoint, app, document);

  await app.listen(3000);
}
bootstrap();
