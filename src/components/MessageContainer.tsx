import React, { useEffect, useRef } from 'react';
import { Message, MessageState, Metadata } from '@/types/chat';
import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Document } from 'langchain/document';

import styles from '@/styles/Home.module.css';

export const MessageContainer: React.FC<{
  loading: boolean;
  messageState: MessageState;
  onSuggestionClick: (suggestion: string) => void;
}> = ({ loading, messageState, onSuggestionClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = messageState;

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [messages],
  );

  return (
    <div className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5">
      {messages.map((message, index) => (
        <div key={`chatMessage-${index}`}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1}
            onSuggestionClick={onSuggestionClick}
          />
          {message.sourceDocs && message.sourceDocs.length > 0 && (
            <SourceAccordion sourceDocs={message.sourceDocs} msgIdx={index} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
};

const MessageLine: React.FC<{
  message: Message;
  loading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}> = ({ message, loading, onSuggestionClick }) => {
  const msgClass = `p-6 flex ${
    message.type === 'apiMessage' ? 'bg-ec-blue-50' : loading ? '' : 'bg-white'
  }`;

  return (
    <div
      className={`border-b border-b-slate-200 ${
        loading ? styles.usermessagewaiting : ''
      }`}
    >
      <div className={`${msgClass} container`}>
        {message.type === 'apiMessage' ? (
          <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
        ) : (
          <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
        )}
        <div className={styles.markdownanswer + ''}>
          <ReactMarkdown linkTarget="_blank" className="flex flex-col gap-4 text-black">
            {message.message}
          </ReactMarkdown>
          {message.suggestions && (
            <ul className="list-none">
            {message.suggestions.map((suggestion, i) => (
              <li
                className="list-none hover:cursor-pointer hover:underline"
                onClick={() => onSuggestionClick(suggestion)}
                key={`suggestion-${i}`}
                style={{ color: 'black', fontWeight: 'bold' }}
              >{`👉 ${suggestion}`}</li>
            ))}
          </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const formatMetadataText = (text: string): string => {
  let formattedText = text;
  if (!text.startsWith('.') && !text.charAt(0).match(/[A-Z]/)) {
    formattedText = '...' + formattedText;
  }
  if (!text.endsWith('.') && !text.charAt(text.length - 1).match(/[A-Z]/)) {
    formattedText += '...';
  }
  return formattedText;
};

const SourceAccordion: React.FC<{
  sourceDocs: Metadata[];
  msgIdx: number;
}> = ({ sourceDocs, msgIdx }) => {
  const accordionEndRef = useRef<HTMLDivElement>(null);
  return (
    <div className="text-black" key={`sourceDocsAccordion-${msgIdx}`}>
      <Accordion
        type="single"
        collapsible
        className="bg-ec-grey-50 flex flex-col px-4"
      >
        <AccordionItem className="" value={`item-${msgIdx}`}>
          <AccordionTrigger
            className="container"
            onClick={() =>
              accordionEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <h3>Click For Sources</h3>
          </AccordionTrigger>
          <AccordionContent className="container">
            <>
              <ul className="list-disc">
              {sourceDocs.map((doc, index) => (
                <div key={index}>
                  <p>{formatMetadataText(doc.text)}</p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>{doc.url}</a>
                </div>
              ))}
              </ul>
            </>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};