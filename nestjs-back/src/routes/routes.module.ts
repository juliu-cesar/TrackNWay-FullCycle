import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MapsModule } from 'src/maps/maps.module';
import { NewPointsJob } from './new-points.job';
import { RouteKafkaProducerJob } from './route-kafka-producer.job';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RoutesGateway } from './routes/routes.gateway';

@Module({
  imports: [
    MapsModule,
    BullModule.registerQueue(
      { name: 'new-points' },
      { name: 'kafka-producer' },
    ),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICES',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nest',
            brokers: ['host.docker.internal:9094'],
          },
        },
      },
    ]),
  ],
  controllers: [RoutesController],
  providers: [
    RoutesService,
    RoutesDriverService,
    RoutesGateway,
    NewPointsJob,
    RouteKafkaProducerJob,
  ],
})
export class RoutesModule {}
