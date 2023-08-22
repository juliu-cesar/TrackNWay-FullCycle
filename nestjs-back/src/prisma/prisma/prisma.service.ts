import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Com o 'OnModuleInit' assim que a aplicação iniciar, o método abaixo habilita uma conexão com o db
  async onModuleInit() {
    await this.$connect;
  }
}
