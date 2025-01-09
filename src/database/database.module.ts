import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/config';

@Global()
@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { connection, user, password, dbName, host } =
          configService.mongo;
        const uri = `${connection}${user}:${password}${host}/?retryWrites=true&w=majority&appName=milibroapp`;
        return {
          uri,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
