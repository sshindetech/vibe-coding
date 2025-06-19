import { Injectable } from '@nestjs/common';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from "@google/generative-ai";
import * as XLSX from 'xlsx';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import type { Document } from "@langchain/core/documents";
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class LangChainService {
    private vectorStore: MemoryVectorStore;
    private embeddings: GoogleGenerativeAIEmbeddings;
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
    * Process an Excel file buffer, extract text, create embeddings, and store in vector store.
    */
    async createEmbeddingAndUpdateVectorStore(excelJson: string) { //buffer: Buffer
        // Parse Excel file
        // const workbook = XLSX.read(buffer, { type: 'buffer' });
        // let allText = '';
        // workbook.SheetNames.forEach((sheetName) => {
        //   const sheet = workbook.Sheets[sheetName];
        //   const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        //   allText += json.map((row: any[]) => row.join(' ')).join('\n');
        // });
        // Create embedding and add to vector store
        await this.vectorStore.addDocuments([{ pageContent: excelJson, metadata: {} }]);
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
        // const vectorStoreRetriever = this.vectorStore.asRetriever();
        
        // // Create a system & human prompt for the chat model
        // const SYSTEM_TEMPLATE = `Use the context to answer the user question.
        // If you don't know the answer, just say that you don't know, don't try to make up an answer.
        // ----------------
        // {context}`;
        
        // const prompt = ChatPromptTemplate.fromMessages([
        //     ["system", SYSTEM_TEMPLATE],
        //     ["human", "{question}"],
        // ]);
        const formatDocumentsAsString = (documents: Document[]) => {
            return documents.map((document) => document.pageContent).join("\n\n");
        };
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

        const response = await this.vectorStore.asRetriever().invoke(query);
        return formatDocumentsAsString(response);
    }
}
