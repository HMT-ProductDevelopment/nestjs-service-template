
import { RequestHandler, BaseCommandHandler, BaseCommand, Session } from 'be-core';
import { ExampleQueries } from '@modules/shared/queries/example.queries';
import { Example } from '@entities/example';
import { Nullable } from '@type/common.type';
import { ExampleRepository } from '@shared/repositories/example.repositories';

export class DeleteCommand extends BaseCommand<number> {
    code: string
    constructor(code: string) {
        super()
        this.code = code;
    }
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, Nullable<Example>> {
    constructor(
        private exampleRepository: ExampleRepository,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }

    async apply(command: DeleteCommand) {
        let data = await this.exampleQueries.getByCode(command.code);
        if (data && !data.isDeleted) {
            return this.exampleRepository.save(data);
        }
        return data;
    }
}
