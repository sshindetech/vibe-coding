import { Controller, Post, UploadedFile, UseInterceptors, Body, Inject, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyzeResponseDto } from './analyze-response.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('CLIENT_EXCEL_SERVICE') private readonly excelService: ClientProxy,
    @Inject('CLIENT_AI_SERVICE') private readonly aiService: ClientProxy,
  ) {}
  
  @Get('health')
  health() {
    return { status: 'ok' };
  }
  
  @Post('upload')
  @ApiOperation({ summary: 'Upload Excel file and store in vector store' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 200, description: 'File uploaded and stored.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: any) {
    // Store the file in the vector store (no query)
    const response = await this.excelService.send('parse_excel', { file }).toPromise();
    return { summary: response.message, chartData: null };
  }
  
  @Post('delete-file')
  @ApiOperation({ summary: 'Delete all embeddings for a specific file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
      },
      required: ['filename'],
    },
  })
  @ApiResponse({ status: 200, description: 'File embeddings deleted.' })
  async deleteFile(@Body('filename') filename: string) {
    return await this.excelService.send('delete_file_embeddings', { filename }).toPromise();
  }
  
  @Post('list-files')
  @ApiOperation({ summary: 'List all uploaded files' })
  @ApiResponse({ status: 200, description: 'List of uploaded files.' })
  async listFiles() {
    return await this.excelService.send('list_uploaded_files', {}).toPromise();
  }
  
  @Post('query')
  @ApiOperation({ summary: 'Query financial data from stored Excel file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
  })
  @ApiResponse({ status: 200, description: 'Summary and chart data returned.', type: AnalyzeResponseDto })
  async queryExcel(@Body('query') query: string) {
    const result = await this.aiService.send('analyze_data', { query }).toPromise();
    return { summary: result.summary, chartData: result.chartData };
  }
}
