import React, { useState } from 'react';
import { Message, MessageState } from '@/types/chat';
import Layout from '@/components/layout';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';

const initMessages = (): Message[] => [
  {
    message: `Hi! I'm the (unofficial) Electoral Commission chatbot, I search guidance documents so you don’t have to`,
    type: 'apiMessage',
  },
  {
    message: `Remember the answers I provide are **not** legal advice. All data provided should be fact checked with The [Electoral Commission](https://www.electoralcommission.org.uk) tel: 0333 103 1928  
    ![An anime meme where AI is asking if a butterfly is a pigeon](/ai-in-real-life.png)`,
    type: 'apiMessage',
  },
  {
    message: `Ask me a question! Here are some suggestions:  

- How much money can I spend before I have to register?  
- What are the spending limits for political parties?  
- Do I need to register if I'm a charity distributing leaflets during an election?`,
    type: 'apiMessage',
  },
];

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<MessageState>({
    messages: initMessages(),
    history: [],
  });

  return (
    <Layout>
      <MessageContainer loading={loading} messageState={messageState} />
      <MessageInput
        loading={loading}
        setLoading={setLoading}
        messageState={messageState}
        setMessageState={setMessageState}
      />
    </Layout>
  );
}
