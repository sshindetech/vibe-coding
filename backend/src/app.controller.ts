import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzeResponseDto } from './analyze-response.dto';
import { AppService } from './app.service';

@ApiTags('Financial Data')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
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
    await this.appService.processUploadedFile(file);
    return { summary: 'File uploaded and stored in vector store.', chartData: null };
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
    // Use the stored vector store for querying
    // You may want to implement a method in AppService for querying only
    // For now, just return a placeholder
    return await this.appService.queryExcel(query);
    // return { summary: 'Query processed (implement logic)', chartData: null };
  }
}
