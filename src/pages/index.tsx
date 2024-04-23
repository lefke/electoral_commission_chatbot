import React, { useEffect, useState } from 'react';
import { Message, MessageState, Metadata } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import Layout from '@/components/layout';
import { MessageInput } from '@/components/MessageInput';
import { MessageContainer } from '@/components/MessageContainer';
import { handleApiRequest } from '@/components/util';

const initMessages = (): Message[] => [
  {
    message: `Hi 👋 I find the information on electoral regulations, and provide sources which link to the Electoral Commission website. Remember - what I say isn't legal advice. Check the sources before acting on the information I provide. \n
![A meme where AI is being used to do a job better](/work-working.gif)`,
    type: 'apiMessage',
  },
  {
    message: `Ask me any question - I index everything on the Electoral Commission website \n
That's a lot of overlapping information on here, so it helps if you're specific. In particular, make it clear whether you're asking about national or local elections. Also let me know which part of the UK you're talking about - England, Scotland, Wales, or Northern Ireland - as the advice may differ. 
\n
Here are some suggestions:  \n`,
    type: 'apiMessage',
    suggestions: [
      "Do I need to register if I'm a charity distributing leaflets during an election?",
      'Can you explain the different voting systems used in UK elections and referendums?',
      "How much can a candidate spend during the regulated period for the police and crime commissioner election in North Wales?"
    ],
  },
];

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<MessageState>({
    messages: initMessages(),
    history: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setTimeout(() => error && setError(null), 2500);
  }, [error]);

  useEffect(() => {
    // Generate or retrieve the userId when the component mounts
    const storedUserId = localStorage.getItem('userId') || uuidv4();
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId); // Update state with the userId

    // Error handling reset
    setTimeout(() => error && setError(null), 2500);
  }, [error]);

  async function handleQuerySubmit(e: any) {
    e.preventDefault();
    setError(null);
  
    if (!query) {
      alert('Please input a question');
      return;
    }
  
    const question = query.trim();
    setLoading(true);
    setQuery('');

    if (!userId) {
      console.error('UserId is not set');
      return;
    }
  
    // Create a user message object and add it to the chat history
    const userMessage: Message = {
      message: question,
      type: 'userMessage', // Ensure you have a 'userMessage' type defined in your Message type
    };
  
    setMessageState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, { message: question, type: 'userMessage' }],
      history: [...prevState.history, ['userMessage', question]], // Adjusted to match the expected tuple structure
    }));
  
    // Initialize a streaming message in the state to display the streamed content
    setMessageState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, { message: '', type: 'apiMessage' }],
      // No need to update history here since the message is initially empty
    }));
  
    // Assuming handleApiRequest is adapted for streaming
    handleApiRequest(
      question,
      userId,
      (token) => {
        // Handle LLM response tokens
        const tokenMessage = typeof token === 'object' ? token.message : token;
        setMessageState((prevState) => {
          const lastIndex = prevState.messages.length - 1;
          const currentMessage = prevState.messages[lastIndex];
          const updatedMessage = {
            ...currentMessage,
            message: currentMessage.message + tokenMessage,
          };
          const newMessages = [...prevState.messages];
          newMessages[lastIndex] = updatedMessage;
          return { 
            ...prevState, 
            messages: newMessages,
            history: [...prevState.history, ['apiMessage', tokenMessage]] // Update history with API response
          };
        });
      },
      (metadata) => {
        // Handle metadata (no changes needed for history)
        setMessageState((prevState) => {
          const lastIndex = prevState.messages.length - 1;
          const currentMessage = prevState.messages[lastIndex];
          const updatedMessage = {
            ...currentMessage,
            sourceDocs: metadata,
          };
          const newMessages = [...prevState.messages];
          newMessages[lastIndex] = updatedMessage;
          return { 
            ...prevState, 
            messages: newMessages,
            // Optionally update history if metadata should be part of it
          };
        });
      },
      (error) => {
        // Handle error
        setError(error);
        setLoading(false);
      },
      () => {
        // Handle completion
        setLoading(false);
      }
    );
  }

  return (
    <Layout>
      <MessageContainer
        loading={loading}
        messageState={messageState}
        onSuggestionClick={setQuery}
      />
      <MessageInput
        loading={loading}
        error={error}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
      />
    </Layout>
  );
}
