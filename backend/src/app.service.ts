import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async analyzeExcel(file: any, query: string) {
    // Parse Excel file buffer
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    // Convert all sheets to JSON
    const sheetsData: Record<string, any> = {};
    workbook.SheetNames.forEach((sheetName) => {
      sheetsData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    // Prepare strict prompt for Gemini
    const prompt = `You are a financial analyst. Here is the data from multiple Excel sheets: ${JSON.stringify(sheetsData)}.\nUser query: ${query}\n\nReply ONLY in the following JSON format:\n{\n  \"summary\": \"<short summary string>\",\n  \"chartData\": {\n    \"type\": \"bar|line|pie|etc\",\n    \"labels\": [<string>],\n    \"datasets\": [\n      {\n        \"label\": \"<dataset label>\",\n        \"data\": [<number>]\n      }\n    ]\n  }\n}`;

    // Use Google Gemini via LangChain
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
      // Ensure response is string for .match()
      const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
      const jsonMatch = responseStr.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseStr;
      const parsed = JSON.parse(jsonString);
      summary = parsed.summary || '';
      chartData = parsed.chartData || null;
      // Validate chartData structure
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
