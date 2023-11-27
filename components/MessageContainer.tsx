import React, { useEffect, useRef } from 'react';
import { Message, MessageState } from '@/types/chat';
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
}> = ({ loading, messageState }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = messageState;

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [messages],
  );

  return (
    <div className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5 ">
      {messages.map((message, index) => (
        <div key={`chatMessage-${index}`}>
          <MessageLine
            message={message}
            loading={loading && index === messages.length - 1}
          />
          {message.sourceDocs && message.sourceDocs.length > 0 && (
            <SourceAccordion sourceDocs={message.sourceDocs} msgIdx={index} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

const MessageLine: React.FC<{
  message: Message;
  loading: boolean;
}> = ({ message, loading }) => {
  const apiMsgClass = 'bg-ec-blue-50 p-6 flex border-b border-b-slate-200';
  const userMsgClass = loading
    ? styles.usermessagewaiting + ' flex'
    : 'bg-white p-6 flex';

  const className = message.type === 'apiMessage' ? apiMsgClass : userMsgClass;
  return (
    <div className={`${className} border-b border-b-slate-200`}>
      {message.type === 'apiMessage' ? (
        <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
      ) : (
        <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
      )}
      <div className={styles.markdownanswer + ' '}>
        <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
      </div>
    </div>
  );
};

const SourceAccordion: React.FC<{
  sourceDocs: Document<Record<string, any>>[];
  msgIdx: number;
}> = ({ sourceDocs, msgIdx }) => {
  return (
    <div className="" key={`sourceDocsAccordion-${msgIdx}`}>
      <Accordion
        type="single"
        collapsible
        className="bg-ec-grey-50 flex flex-col"
      >
        <AccordionItem value={`item-${msgIdx}`}>
          <AccordionTrigger className="mx-8">
            <h3>Source</h3>
          </AccordionTrigger>
          <AccordionContent className="mx-10">
            <ul className="list-disc">
              {sourceDocs.map((doc, index) => (
                <li key={`src-${index}`} className="flex flex-col mb-6">
                  <ReactMarkdown linkTarget="_blank">
                    {doc.pageContent}
                  </ReactMarkdown>
                  <p className="italic">
                    <b>Source:</b> {doc.metadata.source}
                  </p>
                </li>
              ))}
            </ul>
            <div className="w-full text-center text-xs italic text-gray-400 font-light">
              I am an AI powered search tool, all data provided should be fact
              checked
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
