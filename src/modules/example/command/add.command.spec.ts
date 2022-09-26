import { Test } from '@nestjs/testing';
import { ExampleRepository } from '@shared/repositories/example.repositories';
import { Session } from 'be-core';
import { Example } from '~/modules/shared/entities/example';
import { AddCommand, AddCommandHandler } from './add.command';


describe('Example add command test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let handler: AddCommandHandler;

    const exampleRepository = {
        save: jest.fn(),
    };

    const exampleRepositoryProvider = {
        provide: ExampleRepository,
        useFactory: () => exampleRepository,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [exampleRepositoryProvider, AddCommandHandler],
        }).compile();

        handler = await moduleRef.resolve<AddCommandHandler>(AddCommandHandler);
    });

    test('Run apply successfully. Should run as expected', async () => {
        const data = new AddCommand({
            name: 'name',
        } as Example);
        
        await handler.apply(data);

        expect(exampleRepository.save).toBeCalledTimes(1);
        expect(exampleRepository.save).toBeCalledWith(data.data);
    });
});
