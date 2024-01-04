import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import axios from 'axios';
import { Pool } from 'pg';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  
  const { question, history, conversationId } = req.body;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // console.log('question', question);
  // console.log('history', history);
  // console.log('id', conversationId);

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    //create chain
    const chain = makeChain(vectorStore);

    const pastMessages = history.map((message: string, i: number) => {
      if (i % 2 === 0) {
        return new HumanMessage(message);
      } else {
        return new AIMessage(message);
      }
    });

    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: pastMessages
    });

    console.log('sanitizedQuestion:', sanitizedQuestion);

    const updatedHistory = [...history, question, response.text];

    // const DATABASE_URL_0 = process.env.DATABASE_URL || 'http://127.0.0.1:8000/api/chat/';

    // const djangoRes = await axios.post(DATABASE_URL_0, {
    //   // const djangoRes = await axios.post('http://127.0.0.1:8000/api/chat/', {
    //     history: updatedHistory,
    //     response: response,
    //     conversationId: conversationId,
    //   });
  
    // // Sample Id
    //   // c427ab169725fd06d5ecff1d91d78b6c9fc56003ae71a62cd9b54a0190dcb6a5
  
    //   if (djangoRes.status !== 200) {
    //     console.error('Failed to store chat history in Django', djangoRes.data);
    //   }

    const result = await pool.query(
      'INSERT INTO chatapp_chatmessage (history, response, "conversationId", "timestamp") VALUES ($1, $2, $3, NOW())',
      [JSON.stringify(updatedHistory), JSON.stringify(response), conversationId]
    );
  
    if (result.rowCount === 0) {
      console.error('Failed to store chat history in PostgreSQL');
    }
  
    console.log('response', response);
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}