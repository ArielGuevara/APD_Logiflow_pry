import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
    
    @ApiProperty()
    id: string;

    @ApiProperty()
    microservice: string;

    @ApiProperty()
    action: string;

    @ApiProperty()
    entityType: string;

    @ApiProperty()
    entityId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    eventTimeStamp: Date;

    @ApiProperty()
    eventId: string;

    @ApiProperty({ required: false })
    data?: Record<string, any>;

    @ApiProperty()
    severity: string;

    @ApiProperty()
    read: boolean;

    @ApiProperty()
    processed: boolean;

    @ApiProperty({ required: false })
    ip: string;

    @ApiProperty({ required: false })
    hostname: string;
}