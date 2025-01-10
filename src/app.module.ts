import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import config from './config';
import { DatabaseModule } from './database/database.module';
import { environments } from './environments';
import { LibraryModule } from './library/library.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        API_KEY_GOOGLE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_INIT_DB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INIT_DB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_PORT: Joi.number().required(),
        MONGO_CONNECTION: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    LibraryModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
