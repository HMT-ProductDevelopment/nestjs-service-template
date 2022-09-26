import { Type } from 'class-transformer';
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand, Session } from 'be-core';
import { Example } from '@entities/example';
import { ExampleRepository } from '@shared/repositories/example.repositories';
import { Allow } from 'class-validator';

export class AddCommand extends BaseCommand<Example> {
    @Allow()
    @Type(() => Example)
    public data: Example;

    constructor(data: Example) {
        super();
        this.data = data;
    }
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, Example> {
    constructor(
        private exampleRepository: ExampleRepository
    ) {
        super();
    }

    public async apply(command: AddCommand): Promise<Example> {
        return await this.exampleRepository.save(command.data);
    }
}
