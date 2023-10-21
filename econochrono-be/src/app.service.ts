import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppDatabaseService
  extends PrismaClient
  implements OnApplicationBootstrap
{
  async onApplicationBootstrap() {
    await this.$connect();
  }
}
