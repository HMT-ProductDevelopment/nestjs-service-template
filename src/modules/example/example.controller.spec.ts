import { Example } from "@entities/example";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { ExampleQueries } from "@shared/queries/example.queries";
import { Context, HttpService, Mediator, Session, storage } from "be-core";
import { AddCommand, UpdateCommand } from "./command";
import { DeleteCommand } from "./command/delete.command";
import { ExampleController } from "./example.controller";


describe('Example controller test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(storage, 'getStore').mockImplementation(
            () =>
            ({
                request: {
                    scopeVariable: {
                        session: {
                            userId: 'test',
                        },
                    },
                },
            } as unknown as Context)
        );
    });

    let controller: ExampleController;

    const mediator = {
        send: jest.fn(),
    };

    const mediatorProvider = {
        provide: Mediator,
        useFactory: () => mediator,
    };

    const exampleQueries = {
        gets: jest.fn(),
        getByCode: jest.fn(),
    };

    const httpService = {
        get: jest.fn()
    }

    const configService = {
        get: jest.fn()
    }

    const usersQueriesProvider = {
        provide: ExampleQueries,
        useFactory: () => exampleQueries,
    };

    const httpServiceProvider = {
        provide: HttpService,
        useFactory: ()=> httpService
    }
    const configServiceProvider = {
        provide: ConfigService,
        useFactory: ()=> configService
    }

    const requestMock = {
        scopeVariable: {
            accessToken: 'token',
        },
    };

    const requestProvider = {
        provide: REQUEST,
        useFactory: () => requestMock,
    };


    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                requestProvider,
                mediatorProvider,
                usersQueriesProvider,
                httpServiceProvider,
                configServiceProvider,
                ExampleController,
            ],
        }).compile();

        controller = await moduleRef.resolve<ExampleController>(ExampleController);
        controller.scopeVariable.session = {
            userId: 'test',
            roles: [
                {
                    id: 0,
                    name: 'Administrator',
                },
            ]
        } as Session;
    });

    test('Add function. Should run as expected', async () => {
        const data = new AddCommand(new Example({}));

        await controller.add(data);

        expect(mediator.send).toBeCalledTimes(1);
        expect(mediator.send).toBeCalledWith(data);
    });

    test('gets function. Should run as expected', async () => {
        await controller.gets(1, 10);

        expect(exampleQueries.gets).toBeCalledTimes(1);
        expect(exampleQueries.gets).toBeCalledWith(1, 10);
    });


    test('get function. Should run as expected', async () => {
        const code = '62d690ed2dc59d3d690797e0';
        await controller.get(code);

        expect(exampleQueries.getByCode).toBeCalledTimes(1);
        expect(exampleQueries.getByCode).toBeCalledWith(code);
    });

    test('Update function. Should run as expected', async () => {
        const data = new UpdateCommand(new Example({}));

        await controller.update(data.code, data);

        expect(mediator.send).toBeCalledTimes(1);
        expect(mediator.send).toBeCalledWith(data);
    });

    test('Delete function. Should run as expected', async () => {
        const code = '62d690ed2dc59d3d690797e0';
        const data = new DeleteCommand(code);

        await controller.delete(code);

        expect(mediator.send).toBeCalledTimes(1);
        expect(mediator.send).toBeCalledWith(data);
    });
});
