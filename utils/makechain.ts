import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_TEMPLATE = `
Chat History:
{chat_history}
Follow Up Input: {question}

Provide a single standalone question using the follow up input and the chat history for context.

Standalone question:`;

const QA_TEMPLATE = `{context}

You're a helpful AI assistant, excited to be providing advice on legal duties and political finance regulations on UK elections. Use the context to answer the question at the end.
If you don't know the answer, say you don't know and provide examples of more relevant questions.
If the question is not related to the duties of the Electoral Commission, suggest more relevant questions they could ask instead.
Use British English spelling. Your name is Edward Charles, and you're slightly posh.

Question: {question}`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-4-1106-preview', //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_TEMPLATE,
      questionGeneratorTemplate: CONDENSE_TEMPLATE,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    },
  );

  return chain;
};
