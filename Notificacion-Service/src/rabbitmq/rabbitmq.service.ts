import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Connection, Channel, connect, ConsumeMessage } from "amqplib";
import { NotificationsService } from "src/notifications/notifications.service";
import { NotificationEvent } from "./interfaces/notification-event.interface";
import { CreateNotificationDto } from "src/notifications/dto/create-notification.dto";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy{

    private readonly logger = new Logger(RabbitMQService.name);
    private connection: Connection;
    private channel: Channel;
    private readonly exchangeName = 'notifications-logiflow.exchange';
    private readonly queueName = 'notifications-logiflow.queue';
    private readonly routingKey = 'notification-logiflow.routingkey';

    constructor(
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationsService,
    ){}

    async onModuleInit() {
        await this.connect();
        await this.setupQueue();
        await this.consumeMessages();
    }

    async onModuleDestroy() {
        await this.closeConnection();
    } 

    private async connect(): Promise<void>{
        try{
            const host = this.configService.get('RABBITMQ_HOST');
            const port = this.configService.get('RABBITMQ_PORT');
            const username = this.configService.get('RABBITMQ_USER');
            const password = this.configService.get('RABBITMQ_PASSWORD');

            const conexion = `amqp://${username}:${password}@${host}:${port}`;

            this.connection = await connect(conexion);
            this.channel = await this.connection.createChannel();
            this.logger.log('Conexion exitosa a RabbitMQ');
        }catch(error){
            this.logger.error('Error al conectarse a RabbitMQ', error);
            throw error;
        }
    }

    private async consumeMessages(): Promise<void> {
    try {
      await this.channel.consume(
        this.queueName,
        async (message: ConsumeMessage | null) => {
          if (message) {
            try {
              const contentString = message.content.toString();
              this.logger.debug(`Mensaje recibido: ${contentString}`);

              const content = JSON.parse(contentString) as NotificationEvent;

              this.logger.log(
                `Nueva notificación recibida: ${content.action} - ${content.entityType}`,
              );

              // Parsear timestamp
              let eventTimestamp: Date;
              if (content.timestamp) {
                eventTimestamp = new Date(content.timestamp);
                if (isNaN(eventTimestamp.getTime())) {
                  this.logger.warn(`Timestamp inválido, usando fecha actual`);
                  eventTimestamp = new Date();
                }
              } else {
                eventTimestamp = new Date();
              }

              // IMPORTANTE: Crear el DTO explícitamente
              const notificationDto: CreateNotificationDto = {
                eventId: content.eventId,
                microservice: content.microservice,
                action: content.action,
                entityType: content.entityType,
                entityId: content.entityId,
                message: content.message,
                eventTimestamp: eventTimestamp, // ✅ Como Date object
                data: content.data || {},
                severity: content.severity || 'INFO',
                ip: content.ip || '',
                hostname: content.hostName || '',
              };

              this.logger.debug(`DTO completo:`, notificationDto);

              await this.notificationService.create(notificationDto);

              this.channel.ack(message);
              this.logger.log(`Mensaje procesado exitosamente`);
            } catch (error) {
              this.logger.error('Error procesando mensaje:', error);
              this.logger.error('Contenido:', message.content.toString());
              this.channel.nack(message, false, false);
            }
          }
        },
        { noAck: false }
      );

      this.logger.log(`Consumiendo mensajes de: ${this.queueName}`);
    } catch (error) {
      this.logger.error('Error iniciando consumo:', error);
      throw error;
    }
  }

    private async setupQueue(): Promise<void>{
        try{
            // declarar exchange
            await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

            //declarar cola - queue
            await this.channel.assertQueue(this.queueName, {durable: true});

            await this.channel.bindQueue(this.queueName, this.exchangeName, this.routingKey);

            this.logger.log(`Cola ${this.queueName} configurada correctamente`)
        }catch (error){
            this.logger.error(`Error al configurar la cola: ${this.queueName}`, error);
            throw error;
        }
    }

    private async closeConnection(): Promise<void>{
        try{
            if (this.channel){
                await this.channel.close();
            }

            if( this.connection){
                await this.connection.close();
            }
            this.logger.log(`Conexion cerrada correctamente`);
        }catch (error){
            this.logger.error('Error al cerrar la conexion a RabbitMQ', error);
            throw error;
        }
    }
}