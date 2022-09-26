import { CanActivate, ExecutionContext, Injectable, mixin, Type, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService, ScopeVariable, Session } from "be-core";
import { AuthenConfig } from "~/config";
import { AuthenResponse } from "./guard.dto";

@Injectable()
export class UserAuthorize implements CanActivate {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
    }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        context.getHandler();
        const ctx = context.switchToHttp();

        const request = ctx.getRequest<Request & { scopeVariable: { session: Session } }>();

        const authenConfig = this.configService.get<AuthenConfig>('authen')
        if (!authenConfig) return false;

        const tenant = 'c37013b7-44dd-4bc8-839a-dcc3d08294c0'
        const domain = 'hmttest'
        const authBrandUri = authenConfig.authBrandUri
            .replace('{__tenant__=}', tenant)
            .replace('{__domain__=}', domain)
        try {
            const checkUser = await this.httpService.get<{}, AuthenResponse>(authBrandUri, {
                config: {
                    headers: { 'Authorization': request.headers['authorization'] as string }
                }
            })
            if (!checkUser?.status || !checkUser.data) return false;
            request.scopeVariable = {
                ...request.scopeVariable,
                session: {
                    ...request.scopeVariable.session,
                    userId: checkUser.data.userId
                }
            }
        } catch (error) {
            if (!error.status) {
                throw new UnauthorizedException(error, error.message)
            }
        }
        return true;
    }
}
