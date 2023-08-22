import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Global()
// O 'Global' cria uma instancia do modulo que é acessível em qualquer parte da aplicação,
// com isso não sendo necessario ficar importando em todos os arquivos que for utiliza-lo.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
