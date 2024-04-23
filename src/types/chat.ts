import { Document } from 'langchain/document';

export type Message = {
  type: 'apiMessage' | 'userMessage';
  message: string;
  isStreaming?: boolean;
  sourceDocs?: Metadata[];
  suggestions?: string[];
};

export type Metadata = {
  text: string;   // Text content of the document
  url: string;    // URL associated with the document
}

export type MessageState = {
  messages: Message[];
  pending?: string;
  history: [string, string][];
};
