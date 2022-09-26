import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import QueriesList from './queries';
import RepositoriesList from './repositories';
import Entities from './entities';

@Module({
    imports: [TypeOrmModule.forFeature(Entities)],
    providers: [...QueriesList, ...RepositoriesList],
    exports: [...QueriesList, ...RepositoriesList],
})
export class SharedModule {}
