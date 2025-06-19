import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { LangChainService } from './langchain.service';

@Injectable()
export class AppService {
  constructor(private readonly langChainService: LangChainService) {}

  /**
   * Process the uploaded Excel file and store its data in the vector store.
   */
  async processUploadedFile(file: any) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetsData: Record<string, any> = {};
    workbook.SheetNames.forEach((sheetName) => {
      sheetsData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });
    await this.langChainService.createEmbeddingAndUpdateVectorStore(JSON.stringify(sheetsData));
    return { message: 'File processed and stored in vector store.' };
  }

  /**
   * Query the stored vector store using the provided query string.
   */
  async queryExcel(query: string) {
    // You can enhance this to use the vector store for retrieval/QA
    // For now, just return a placeholder or use the latest stored data
    // Optionally, you could retrieve the latest document and use it in the prompt
    // Here, we just use a static prompt for demonstration

    // Prepare strict prompt for Gemini
    const vectorStoreDocsAsString = await this.langChainService.search(query, 3);
    const prompt = `You are a financial analyst. Here is the data from multiple Excel sheets: ${vectorStoreDocsAsString}.\nUser query: ${query}\n\nReply ONLY in the following JSON format:\n{\n  "summary": "<short summary string>",\n  "chartData": {\n    "type": "bar|line|pie|etc",\n    "labels": [<string>],\n    "datasets": [\n      {\n        "label": "<dataset label>",\n        "data": [<number>]\n      }\n    ]\n  }\n}`;


    // const prompt = `User query: ${query}\nReply ONLY in the following JSON format:\n{\n  "summary": "<short summary string>",\n  "chartData": {\n    "type": "bar|line|pie|etc",\n    "labels": [<string>],\n    "datasets": [\n      {\n        "label": "<dataset label>",\n        "data": [<number>]\n      }\n    ]\n  }\n}`;

    const model = new ChatGoogleGenerativeAI({ model: process.env.MODEL_ID!, apiKey: process.env.GOOGLE_API_KEY });
    const response = await model.withStructuredOutput(
      z.object({
        summary: z.string(),
        chartData: z.object({
          type: z.string(),
          labels: z.array(z.string()),
          datasets: z.array(
            z.object({
              label: z.string(),
              data: z.array(z.number()),
            })
          ),
        }),
      })
    ).invoke(prompt);
    let summary = '', chartData = null;
    try {
      const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
      const jsonMatch = responseStr.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseStr;
      const parsed = JSON.parse(jsonString);
      summary = parsed.summary || '';
      chartData = parsed.chartData || null;
      if (chartData && (!chartData.type || !Array.isArray(chartData.labels) || !Array.isArray(chartData.datasets))) {
        throw new Error('Invalid chartData structure');
      }
    } catch {
      summary = typeof response === 'string' ? response : JSON.stringify(response);
      chartData = null;
    }
    return { summary, chartData };
  }
}
