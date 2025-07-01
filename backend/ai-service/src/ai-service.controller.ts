import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LangChainService } from './langchain.service';

@Controller()
export class AiServiceController {
  constructor(private readonly langChainService: LangChainService) {}

  @MessagePattern('analyze_data')
  async analyzeData(data: any) {
    return this.langChainService.queryExcel(data.query);
  }

  @MessagePattern('create_embedding_and_update_vector_store')
  async createEmbeddingAndUpdateVectorStore(data: any) {
    return this.langChainService.createEmbeddingAndUpdateVectorStore(data.data, data.filename);
  }

  @MessagePattern('delete_embeddings_by_filename')
  async deleteEmbeddingsByFilename(data: any) {
    return this.langChainService.deleteEmbeddingsByFilename(data.filename);
  }  
}
