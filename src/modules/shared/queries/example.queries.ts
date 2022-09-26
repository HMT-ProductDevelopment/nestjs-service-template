import { Example } from '@entities/example';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries, Paginated } from 'be-core';
import { Nullable } from 'src/types';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class ExampleQueries extends BaseQueries {
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(Example) 
        private repository: Repository<Example>
    ) {
        super(request);
    }

    public async getByCode(code: string): Promise<Nullable<Example>> {
        return this.repository.findOne({
            where: {
                code,
                isDeleted: false,
            },
        });
    }

    public async gets(pageIndex: number, pageSize: number): Promise<Paginated<Example>> {
        let condition = {};

        const rs = await this.repository.findAndCount({
            where: {
                ...condition,
                isDeleted: false,
            },
            skip: pageIndex * pageSize,
            take: pageSize,
        });
        return {
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalRow: rs[1],
            dataSource: rs[0],
        } as Paginated<Example>;
    }
}