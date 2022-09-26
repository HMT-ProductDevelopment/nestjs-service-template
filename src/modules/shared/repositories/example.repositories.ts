import { Example } from '@entities/example';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { EntityManager, Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class ExampleRepository extends BaseRepository<Example> {
    constructor(
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(Example)
        readonly repository: Repository<Example>
    ) {
        super(entityManager, Example);
    }
}
