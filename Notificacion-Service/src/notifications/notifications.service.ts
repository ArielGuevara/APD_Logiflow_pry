import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    try {

      // Mapear explícitamente cada campo
      const entityNotif = this.notificationRepository.create({
        eventId: dto.eventId,
        message: dto.message,
        action: dto.action,
        microservice: dto.microservice,
        entityId: dto.entityId,
        entityType: dto.entityType,
        eventTimestamp: dto.eventTimestamp, 
        data: dto.data || {},
        severity: dto.severity || 'INFO',
        ip: dto.ip || null,
        hostname: dto.hostname || null,
        read: false,
        processed: false,
      });

      this.logger.debug(`Entidad antes de guardar:`, entityNotif);
      
      const saved = await this.notificationRepository.save(entityNotif);
      
      this.logger.log(`Notificación guardada: ${saved.id} - ${saved.action}`);
      return saved;
    } catch (error) {
      this.logger.error('Error guardando notificación:', error);
      this.logger.error('DTO recibido:', dto);
      throw error;
    }
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: string) {
    return  "this.notificationRepository.findOne({ where: { id } })";
  }
}