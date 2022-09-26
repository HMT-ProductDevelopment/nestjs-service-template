import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { HttpService } from "be-core";
import { Session } from "inspector";
import { UserAuthorize } from "./user.guard";

describe('User Authorize test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let guard: UserAuthorize;

    const httpService = {
        get: jest.fn()
    }

    const configService = {
        get: jest.fn()
    }

    const httpServiceProvider = {
        provide: HttpService,
        useFactory: () => httpService
    }

    const configServiceProvider = {
        provide: ConfigService,
        useFactory: () => configService
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [configServiceProvider, httpServiceProvider, UserAuthorize],
        }).compile();

        guard = await moduleRef.resolve<UserAuthorize>(UserAuthorize);
    });

    test('Run canActivate successful. Should run as expected', async () => {
        const context = {
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    method: 'PATCH',
                    headers: {
                        'authorization': '215f3ca79c6417021669b38bbc1404ecac3d38241b59f68359498dc7f4b194ea',
                    },
                    body: {
                        document: '123',
                    },
                    scopeVariable: {
                        session: new Session(),
                    },
                }),
            })),
        } as unknown as ExecutionContext;
        configService.get.mockReturnValue({
            authBrandUri: 'authBrandUri'
        });
        httpService.get.mockResolvedValue({
            status: true,
            data: {}
        })

        await guard.canActivate(context);

        expect(configService.get).toBeCalledTimes(1);
        expect(configService.get).toBeCalledWith('authen');

        expect(httpService.get).toBeCalledTimes(1);
        expect(httpService.get).toBeCalledWith('authBrandUri', {
            config: {
                headers: {
                    Authorization: '215f3ca79c6417021669b38bbc1404ecac3d38241b59f68359498dc7f4b194ea'
                }
            }
        });
    });
    test('Run canActivate fail. Should run as expected', async () => {
        const context = {
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    method: 'PATCH',
                    headers: {
                        'authorization': '215f3ca79c6417021669b38bbc1404ecac3d38241b59f68359498dc7f4b194ea',
                    },
                    body: {
                        document: '123',
                    },
                    scopeVariable: {
                        session: new Session(),
                    },
                }),
            })),
        } as unknown as ExecutionContext;
        configService.get.mockReturnValue({
            authBrandUri: 'authBrandUri'
        });
        httpService.get.mockRejectedValue({
            status: false,
            data: {}
        })
        try {
            await guard.canActivate(context);

        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException)
        }
        expect(configService.get).toBeCalledTimes(1);
        expect(configService.get).toBeCalledWith('authen');

        expect(httpService.get).toBeCalledTimes(1);
        expect(httpService.get).toBeCalledWith('authBrandUri', {
            config: {
                headers: {
                    Authorization: '215f3ca79c6417021669b38bbc1404ecac3d38241b59f68359498dc7f4b194ea'
                }
            }
        });

    });
})