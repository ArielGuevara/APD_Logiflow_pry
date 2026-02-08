import { IsString, IsUUID, IsOptional, IsObject, IsDateString, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  eventId: string;

  @IsString()
  message: string;

  @IsString()
  @IsIn(['CREATE', 'UPDATE', 'DELETE'])
  action: string;

  @IsString()
  microservice: string;

  @IsUUID()
  entityId: string;
  
  @IsString()
  entityType: string;

  @IsDateString()
  eventTimestamp: Date;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  @IsIn(['INFO', 'WARNING', 'ERROR'])
  severity?: string;

  ip?: string;
  hostname?: string;
}