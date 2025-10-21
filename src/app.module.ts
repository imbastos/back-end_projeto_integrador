import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { ResourcesModule } from './resources/resources.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [CompaniesModule, ResourcesModule, QueuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
