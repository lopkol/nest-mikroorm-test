import { DocumentBuilder } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';

export interface SwaggerConfig {
  /**
   * The endpoint used to reach the swagger.
   */
  endpoint: string;

  /**
   * The Swagger document configuration object.
   */
  documentConfig: Omit<OpenAPIObject, 'paths'>;
}

/**
 * Create the swagger configuration.
 * @returns {SwaggerConfig}
 */
export function createSwaggerConfig(): SwaggerConfig {
  return {
    endpoint: 'api',
    documentConfig: new DocumentBuilder()
      .setTitle('Nest MikroORM test API')
      .setVersion('1.0')
      .build(),
  };
}
