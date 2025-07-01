import { Module } from '@nestjs/common';
import { AiServiceController } from './ai-service.controller';
import { LangChainService } from './langchain.service';

@Module({
  controllers: [AiServiceController],
  providers: [LangChainService],
})
export class AiServiceModule {}
