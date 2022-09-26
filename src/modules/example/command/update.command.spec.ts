import { Test } from '@nestjs/testing';
import { ExampleQueries } from '@shared/queries/example.queries';
import { ExampleRepository } from '@shared/repositories/example.repositories';
import { BusinessException, Session } from 'be-core';
import { Example } from '~/modules/shared/entities/example';
import { AddCommand, AddCommandHandler } from './add.command';
import { UpdateCommand, UpdateCommandHandler } from './update.command';


describe('Example update command test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let handler: UpdateCommandHandler;

    const exampleRepository = {
        save: jest.fn(),
    };

    const exampleQueries = {
        getByCode: jest.fn()
    }
    
    const exampleRepositoryProvider = {
        provide: ExampleRepository,
        useFactory: () => exampleRepository,
    };

    const exampleQueriesProvider = {
        provide: ExampleQueries,
        useFactory: () => exampleQueries,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                exampleRepositoryProvider,
                exampleQueriesProvider,
                UpdateCommandHandler
            ],
        }).compile();

        handler = await moduleRef.resolve<UpdateCommandHandler>(UpdateCommandHandler);
    });

    test('Run apply successfully. Should run as expected', async () => {

        exampleQueries.getByCode.mockResolvedValue({
            name: 'name'
        })
        const data = new UpdateCommand({
            name: 'name',
        } as Example);

        await handler.apply(data);

        expect(exampleQueries.getByCode).toBeCalledTimes(1);
        expect(exampleQueries.getByCode).toBeCalledWith(data.data.code);
        expect(exampleRepository.save).toBeCalledTimes(1);
        expect(exampleRepository.save).toBeCalledWith(data.data);
    });

    test('Run apply fail with data not exists. Should run as expected', async () => {

        exampleQueries.getByCode.mockResolvedValue(null)
        const data = new UpdateCommand({
            name: 'name',
        } as Example);

        try {
            await handler.apply(data);
        } catch (error) {
            expect(error).toEqual(new BusinessException('Dữ liệu không tồn tại'))
        }

        expect(exampleQueries.getByCode).toBeCalledTimes(1);
        expect(exampleQueries.getByCode).toBeCalledWith(data.data.code);
        expect(exampleRepository.save).toBeCalledTimes(0);
    });
});
