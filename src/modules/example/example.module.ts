import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';
import { AddCommandHandler } from './command';
import { ExampleController } from './example.controller';

@Module({
    imports: [SharedModule, CQRSModule,
        HttpModule.register({
            config: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        }),
    ],
    controllers: [ExampleController],
    providers: [AddCommandHandler]
})
export class ExampleModule { }
