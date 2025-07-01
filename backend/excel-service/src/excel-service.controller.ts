import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExcelServiceService } from './excel-service.service';

@Controller()
export class ExcelServiceController {
  constructor(private readonly excelService: ExcelServiceService) {}

  @MessagePattern('parse_excel')
  async parseExcel(data: {file:Express.Multer.File}) {
    return this.excelService.processUploadedFile(data);
  }
  
  @MessagePattern('delete_file_embeddings')
  async deleteFileEmbeddings(data: { filename: string }) {
    return this.excelService.deleteFileEmbeddings(data.filename);
  }
  
  @MessagePattern('list_uploaded_files')
  async listUploadedFiles() {
    return this.excelService.listUploadedFiles();
  }

}
