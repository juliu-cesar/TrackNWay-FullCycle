import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Job } from 'bull';

@Processor('kafka-producer')
export class RouteKafkaProducerJob {
  constructor(
    @Inject('KAFKA_SERVICES')
    private kafkaService: ClientKafka,
  ) {}

  @Process()
  async handle(job: Job<any>) {
    this.kafkaService.emit('route', job.data);
    return {};
  }
}
