import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialModule } from 'be-core';
import { load } from './config';
import { modules } from './modules';

@Module({
  imports: [
    InitialModule,
    ConfigModule.forRoot({
      load: [load],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get<string>('mongodbUrl'),
          entities: [__dirname + '/modules/shared/entities/*{.ts,.js}'],
          synchronize: false,
          retryAttempts: 3,
          retryDelay: 1000,
          useUnifiedTopology: true,
          forceServerObjectId: true,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ...modules
  ],
  providers: [],
})
export class AppModule { }
