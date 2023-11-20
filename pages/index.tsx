import { useRef, useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import { 
    UserCircleIcon,
    ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/solid'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Layout from '@/components/layout';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
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
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      const appendResponse = await fetch('/api/appendQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!appendResponse.ok) {
        console.error('Failed to append question to CSV');
      }

      //scroll to bottom
      messageListRef.current?.scrollTo(-90, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <Layout>
        <div ref={messageListRef} className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5 ">
        {messages.map((message, index) => {
            let icon;
            let className;
            if (message.type === 'apiMessage') {
            icon = (
                <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec_blue mr-3" />
            );
            className = "bg-ec_blue_03 p-6 flex  border-b border-b-slate-200";
            } else {
            icon = (
                <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
            );
            // The latest message sent by the user will be animated while waiting for a response
            className =
                loading && index === messages.length - 1
                ? styles.usermessagewaiting + " flex"
                : "bg-white p-6 flex";
            }
            return (
            <>
                <div key={`chatMessage-${index}`} className={className + " border-b border-b-slate-200"}>
                {icon}
                <div className={styles.markdownanswer + " "}>
                    <ReactMarkdown linkTarget="_blank">
                    {message.message}
                    </ReactMarkdown>
                </div>
                </div>
                {message.sourceDocs && (
                <div
                    className=""
                    key={`sourceDocsAccordion-${index}`}
                >
                    <Accordion
                    type="single"
                    collapsible
                    className="flex-col"
                    >
                    {message.sourceDocs.map((doc, index) => (
                        <div key={`messageSourceDocs-${index}`}>
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                            <h3>Source {index + 1}</h3>
                            </AccordionTrigger>
                            <AccordionContent>
                            <ReactMarkdown linkTarget="_blank">
                                {doc.pageContent}
                            </ReactMarkdown>
                            <p className="mt-2">
                                <b>Source:</b> {doc.metadata.source}
                            </p>
                            <div className="text-xs">I am an AI powered search tool, all data provided should be fact checked</div>
                            </AccordionContent>
                        </AccordionItem>
                        </div>
                    ))}
                    </Accordion>
                </div>
                )}
            </>
            );
        })}
        </div>
        <div id="input-center" className="flex justify-center align-center px-4 py-0 flex-row -order-1 my-[16px]">
        {error && (
            <div className="border border-red-400 rounded-md p-4">
            <p className="text-red-500">{error}</p>
            </div>
        )}
            <div className={styles.cloudform + " relative w-full"}>
            <form
            onSubmit={handleSubmit}
            className="relative w-full"
            >
                <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={
                    loading
                    ? 'Waiting for response...'
                    : 'Ask a question...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.textarea + " relative w-full"}
                />
                <button
                type="submit"
                disabled={loading}
                className="bottom-5 right-4 text-neutral-400 bg-none p-1.5 border-none absolute "
                >
                {loading ? (
                    <div className={styles.loadingwheel + " bottom-2 right-3 absolute"}>
                    <LoadingDots color="#003057" />
                    </div>
                ) : (
                    // Send icon SVG in input field
                    <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                )}
                </button>
            </form>
            </div>
        </div>
      </Layout>
    </>
  );
}
