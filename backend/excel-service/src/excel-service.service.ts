import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFile } from './uploaded-file.entity';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ExcelServiceService {
  constructor(
    @InjectRepository(UploadedFile) private readonly uploadedFileRepo: Repository<UploadedFile>,
    @Inject('CLIENT_AI_SERVICE') private readonly aiService: ClientProxy,
  ) {}
  
  /**
  * Process the uploaded Excel file and store its data in the vector store.
  */
  async processUploadedFile(data: {file:any}) {
    const workbook = XLSX.read(data.file.buffer.data, { type: 'buffer' });
    const sheetsData: Record<string, any> = {};
    workbook.SheetNames.forEach((sheetName) => {
      sheetsData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });
    const filename = data.file.originalname || 'unknown.xlsx';
    await this.aiService.send('create_embedding_and_update_vector_store', {
      data: JSON.stringify(sheetsData),
      filename
    }).toPromise();
    
    // Save file info to DB if not already present
    let uploaded = await this.uploadedFileRepo.findOne({ where: { filename } });
    if (!uploaded) {
      uploaded = this.uploadedFileRepo.create({ filename, originalname: data.file.originalname });
      await this.uploadedFileRepo.save(uploaded);
    }
    return { message: 'File processed and stored in vector store.' };
  }
  
  async listUploadedFiles() {
    return this.uploadedFileRepo.find({ order: { uploadedAt: 'DESC' } });
  }
  
  /**
  * Delete all embeddings for a given filename from the vector store and remove the DB record.
  */
  async deleteFileEmbeddings(filename: string) {
    await this.aiService.send('delete_embeddings_by_filename', {
      filename
    }).toPromise();
    
    await this.uploadedFileRepo.delete({ filename });
    return { message: `Embeddings and DB record for file '${filename}' deleted.` };
  }
  
}
