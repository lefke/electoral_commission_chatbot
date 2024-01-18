import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/

const filePath = 'docs/extra';
const processedPath = 'processed_docs';
const batchSize = 25;

export const run = async () => {
  try {
    console.log('Starting data ingestion...');
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    const rawDocs = await directoryLoader.load();
    console.log(`Loaded ${rawDocs.length} documents`);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    console.log('creating vector store...');
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    for (let i = 0; i < rawDocs.length; i += batchSize) {
      const batch = rawDocs.slice(i, i + batchSize);
      const docs = await textSplitter.splitDocuments(batch);
      console.log(`Split batch ${i / batchSize + 1} into ${docs.length} chunks`);

      if (batch.length > 0 && batch[0].metadata && batch[0].metadata['source']) {
        console.log(`Batch ${i / batchSize + 1} source: ${batch[0].metadata['source']}`);
      }

      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: PINECONE_NAME_SPACE,
        textKey: 'text',
      });
      console.log(`Batch ${i / batchSize + 1} vectorized and stored`);
    }
    

    // const docs = await textSplitter.splitDocuments(rawDocs);
    // console.log(`Split documents into ${docs.length} chunks`);
    
    // console.log('split docs', docs);

    // console.log('creating vector store...');
    // /*create and store the embeddings in the vectorStore*/
    // const embeddings = new OpenAIEmbeddings();
    // const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    // //embed the PDF documents
    // await PineconeStore.fromDocuments(docs, embeddings, {
    //   pineconeIndex: index,
    //   namespace: PINECONE_NAME_SPACE,
    //   textKey: 'text',
    // });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
