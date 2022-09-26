import { AuditEntity } from "@core/common.model";
import { ObjectID } from 'mongodb';
import { Column, Entity, Generated, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity('example', { schema: 'dizim_db' })
export class Example extends AuditEntity {
    @Generated()
    @Column('_id')
    @ObjectIdColumn()
    id: string | ObjectID;

    @Column('code')
    code: string

    @Column('name')
    name: string
    constructor(entity: Partial<Example>) {
        super()
        Object.assign(this, entity)
    }
}
