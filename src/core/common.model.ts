import { BaseEntity } from 'be-core';
import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class AuditEntity extends BaseEntity {
    @Exclude()
    @Column({ name: 'is_deleted' })
    isDeleted: boolean;

    @Column({ name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'created_by' })
    createdBy:  string;

    @Column({ name: 'modified_date' })
    modifiedDate?: Date;

    @Column({ name: 'modified_by' })
    modifiedBy?: string;
}
