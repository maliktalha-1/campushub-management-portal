import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://campushub-management-portal-qoub1oocq-maliktalha-1s-projects.vercel.app",
      "https://campushub-management-portal-1qug4bejo-maliktalha-1s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("CampusHub API")
    .setDescription("CampusHub Management Portal Backend API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "CampusHub API Docs",
  });

  const port = process.env.PORT || 5000;

  await app.listen(port, "0.0.0.0");

  console.log(`🚀 Backend running on port ${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api`);
}

bootstrap();