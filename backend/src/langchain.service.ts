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
