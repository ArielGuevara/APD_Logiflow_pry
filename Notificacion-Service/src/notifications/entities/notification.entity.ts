import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('notification')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'event_id', nullable:false})
    @Index()
    eventId: string;

    @Column({name: 'message', nullable: false})
    message: string;

    @Column({name: 'action', nullable:false, length:20})
    action: string;

    @Column({name: 'microservice', nullable:false})
    microservice: string;

    @Column({name: 'entity_id', nullable:false,})
    @Index()
    entityId: string;

    @Column({name: 'entity_type', nullable:false})
    entityType: string;

    @Column({name: 'ip', type: 'varchar', nullable:true})
    ip: string | null;

    @Column({name: 'hostname', type: 'varchar', nullable:true})
    hostname: string | null;

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @Column({name: 'event_timestamp', type: 'timestamp'})
    eventTimestamp: Date;

    @Column({name: 'read', type:'boolean', default:false})
    read:boolean;

    @Column({name: 'processed', type:'boolean', default:false})
    processed: boolean;

    @Column({name: 'data', type:'jsonb', nullable:true})
    data: Record<string, any>;

    @Column({name: 'severity', nullable: true, length: 20, default: 'INFO'}) 
    severity: string;
}
