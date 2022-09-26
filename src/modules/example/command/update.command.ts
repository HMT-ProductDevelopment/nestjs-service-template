
import { Example } from '@entities/example';
import { ExampleQueries } from '@shared/queries/example.queries';
import { ExampleRepository } from '@shared/repositories/example.repositories';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler, Session } from 'be-core';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';

export class UpdateCommand extends BaseCommand<Example> {
    @Allow()
    code: string;
    @Allow()
    @Type(() => Example)
    public data: Example;

    constructor(data: Example) {
        super();
        this.data = data;
    }
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, Example> {
    constructor(
        private exampleRepository: ExampleRepository,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<Example> {

        let example = await this.exampleQueries.getByCode(command.data.code);

        if (!example) {
            throw new BusinessException('Dữ liệu không tồn tại');
        }
        example.name = command.data.name;
        return await this.exampleRepository.save(example);
    }
}
