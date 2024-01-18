import React, { useState } from 'react';
import { Message, MessageState } from '@/types/chat';
import Layout from '@/components/layout';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';

const initMessages = (): Message[] => [
  {
    message: `Hi! I find information and sources directly from the the Electoral Commission website to make your life easier!\n
    \u00A0\n
![A meme where AI is being used to do a job better](/work-working.gif)`,
    type: 'apiMessage',
  },
  {
    message: `Ask me a question or give me a prompt! 
I index everything published by the Electoral Commission, so you can be as specific as you like.\n
\u00A0\n
Here are some suggestions:  \n
\u00A0\n
👉 Do I need to register if I'm a charity distributing leaflets during an election?\n
👉 What's the typical budget for a Police and Crime Commissioner campaign in Manchester?  \n
👉 Provide a structured response indicating the spending limits for political parties at each stage in the election`,
    type: 'apiMessage',
  },
];

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<MessageState>({
    messages: initMessages(),
    history: [],
  });

// Function to handle suggestion clicks
const handleSuggestionClick = (suggestion: string) => {
  // Update the messageState with the new user message
  setMessageState((prevState) => ({
    ...prevState,
    messages: [
      ...prevState.messages,
      {
        type: 'userMessage',
        message: suggestion,
      },
    ],
    // Optionally, add to history if needed
    history: [...prevState.history, [suggestion, '']],
  }));
};

  return (
    <Layout>
      <MessageContainer
        loading={loading}
        messageState={messageState}
        onSuggestionClick={handleSuggestionClick}
      />
      <MessageInput
        loading={loading}
        setLoading={setLoading}
        messageState={messageState}
        setMessageState={setMessageState}
      />
    </Layout>
  );
}
