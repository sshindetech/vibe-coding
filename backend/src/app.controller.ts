import { Controller, Get, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AnalyzeResponseDto } from './analyze-response.dto';

@ApiTags('Financial Data')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Upload Excel file and query financial data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        query: {
          type: 'string',
        },
      },
      required: ['file', 'query'],
    },
  })
  @ApiResponse({ status: 200, description: 'Summary and chart data returned.', type: AnalyzeResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async analyzeExcel(
    @UploadedFile() file: any, // Use 'any' to avoid Multer type error
    @Body('query') query: string,
  ) {
    return this.appService.analyzeExcel(file, query);
  }
}
