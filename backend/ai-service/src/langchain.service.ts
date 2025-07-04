import { TaskType } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { z } from 'zod';

@Injectable()
export class LangChainService {
    private vectorStore: MemoryVectorStore;
    private embeddings: GoogleGenerativeAIEmbeddings;
    private allDocuments: Document[] = [];
    /**
    * Initialize the LangChain service with a memory vector store and Google Generative AI embeddings.
    */
    constructor() {
        this.embeddings = new GoogleGenerativeAIEmbeddings({
            model: "text-embedding-004", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "Document title",
            apiKey: process.env.GOOGLE_API_KEY, // Ensure you set this in your environment
        });
        this.vectorStore = new MemoryVectorStore(this.embeddings);
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
        const vectorStoreDocsAsString = await this.search(query, 3);
        const prompt = `You are a financial analyst. Here is the data from multiple Excel sheets: ${vectorStoreDocsAsString}.\nUser query: ${query}\n\nReply ONLY in the following JSON format:\n{\n  "summary": "<short summary string>",\n  "chartData": {\n    "type": "bar|line|pie|etc",\n    "labels": [<string>],\n    "datasets": [\n      {\n        "label": "<dataset label>",\n        "data": [<number>]\n      }\n    ]\n  }\n}`;
        
        
        // const prompt = `User query: ${query}\nReply ONLY in the following JSON format:\n{\n  "summary": "<short summary string>",\n  "chartData": {\n    "type": "bar|line|pie|etc",\n    "labels": [<string>],\n    "datasets": [\n      {\n        "label": "<dataset label>",\n        "data": [<number>]\n      }\n    ]\n  }\n}`;
        
        const datasetSchema = z.object({
            label: z.string(),
            data: z.array(z.number()),
        });

        const chartDataSchema = z.object({
            type: z.string(),
            labels: z.array(z.string()),
            datasets: z.array(datasetSchema),
        });

        const responseSchema = z.object({
            summary: z.string(),
            chartData: chartDataSchema,
        });

        const model = new ChatGoogleGenerativeAI({ model: process.env.MODEL_ID!, apiKey: process.env.GOOGLE_API_KEY });
        const response = await model.withStructuredOutput(
            responseSchema
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
    
    /**
    * Process an Excel file buffer, extract text, create embeddings, and store in vector store.
    * @param excelJson The JSON string of the Excel file contents
    * @param filename The name of the uploaded file
    */
    async createEmbeddingAndUpdateVectorStore(excelJson: string, filename: string) {
        const doc = { pageContent: excelJson, metadata: { filename } };
        this.allDocuments.push(doc);
        await this.vectorStore.addDocuments([doc]);
    }
    
    /**
    * Delete all documents from the vector store for a given filename.
    * @param filename The name of the file whose embeddings should be deleted
    */
    async deleteEmbeddingsByFilename(filename: string) {
        this.allDocuments = this.allDocuments.filter(doc => doc.metadata?.filename !== filename);
        // Re-initialize the vector store and re-add remaining documents
        this.vectorStore = new MemoryVectorStore(this.embeddings);
        if (this.allDocuments.length > 0) {
            await this.vectorStore.addDocuments(this.allDocuments);
        }
    }
    
    /**
    * Get the underlying vector store instance.
    */
    getVectorStore() {
        return this.vectorStore;
    }
    
    /**
    * Search for similar documents in the vector store given a query text.
    * @param query The text to search for.
    * @param k Number of top results to return.
    */
    async search(query: string, k = 3) {
        const formatDocumentsAsString = (documents: Document[]) => {
            return documents.map((document) => document.pageContent).join("\n\n");
        };

        const vectorStoreRetriever = this.vectorStore.asRetriever();
        
        // // Create a system & human prompt for the chat model
        // const SYSTEM_TEMPLATE = `Use the context to answer the user question.
        // If you don't know the answer, just say that you don't know, don't try to make up an answer.
        // ----------------
        // {context}`;
        
        // const prompt = ChatPromptTemplate.fromMessages([
        //     ["system", SYSTEM_TEMPLATE],
        //     ["human", "{question}"],
        // ]);

        // const model = new ChatGoogleGenerativeAI({ model: process.env.MODEL_ID!, apiKey: process.env.GOOGLE_API_KEY });
        // const chain = RunnableSequence.from([
        //     {
        //         context: vectorStoreRetriever.pipe(formatDocumentsAsString),
        //         question: new RunnablePassthrough(),
        //     },
        //     prompt,
        //     model,
        //     new StringOutputParser(),
        // ]);
        
        // const response = await chain.invoke(query);
        
        // return response;
        
        const response = await vectorStoreRetriever.invoke(query);
        return formatDocumentsAsString(response);
    }
}
