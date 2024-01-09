import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from '@api/controllers/controllers.module';
import { CommonModule } from '@api/common/common.module';

@Module({
  imports: [
    CommonModule,
    ControllersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
