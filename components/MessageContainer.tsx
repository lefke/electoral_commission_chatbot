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

//Adjust the source back to URL format and handle PDFs
function formatSource(source: string): JSX.Element {
  if (typeof source !== 'string') {
    // Handle the case where source is not a string
    return <span>Source not available</span>;
  }
  const baseUrl = 'https://www.electoralcommission.org.uk/';
  let adjustedSource = source
    .slice(0, -4) // Remove the '.pdf'
    .replace(/.*docs\/(batch_[0-9]\/)?/, '') // Remove the leading directory structure
    .replace(/_(.{15})$/, '') // Remove characters after the final '_' if there are exactly 15 characters
    .replace(/___/g, '/')
    .replace(/__/g, '/');

  const parts = adjustedSource.split('/');
  const lastSegment = parts.pop();
  const isPdf = lastSegment && lastSegment.length === 15;

  const finalUrl = isPdf ? baseUrl + parts.join('/') : baseUrl + adjustedSource;
  const displayText = isPdf ? 'PDF in page' : finalUrl;

  return (
    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
      {displayText}
    </a>
  );
}

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
    <div className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5">
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
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
};

const MessageLine: React.FC<{
  message: Message;
  loading: boolean;
}> = ({ message, loading }) => {
  const apiMsgClass = 'bg-ec-blue-50 p-6 flex';
  const userMsgClass = loading
    ? styles.usermessagewaiting + ' flex'
    : 'bg-white p-6 flex';

  const className = message.type === 'apiMessage' ? apiMsgClass : userMsgClass;
  return (
    <div className={`border-b border-b-slate-200`}>
      <div className={`${className} container`}>
        {message.type === 'apiMessage' ? (
          <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec-blue-900 mr-3" />
        ) : (
          <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
        )}
        <div className={styles.markdownanswer + ''}>
          <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

function getUniqueSourceDocs(sourceDocs: Document<Record<string, any>>[]): Document<Record<string, any>>[] {
  const uniqueDocs = new Map<string, Document<Record<string, any>>>();

  sourceDocs.forEach((doc) => {
    const normalizedContent = doc.pageContent.toLowerCase(); // Normalize to lower case for comparison
    if (!uniqueDocs.has(normalizedContent)) {
      uniqueDocs.set(normalizedContent, doc);
    }
  });

  return Array.from(uniqueDocs.values());
}

// Helper function to format the document content for display
function formatDocumentContent(content: string): string {
  // Replace multiple newlines and spaces with a single space
  let cleanedContent = content
    .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with a single space
    .trim(); // Trim whitespace from the start and end

  // Add '...' to the beginning if it doesn't start with a capital letter
  if (cleanedContent && !cleanedContent.charAt(0).match(/[A-Z]/)) {
    cleanedContent = '...' + cleanedContent;
  }

  // Add '...' to the end if it doesn't end with a full stop
  if (cleanedContent && !cleanedContent.endsWith('.')) {
    cleanedContent += '...';
  }
  return cleanedContent;
}

const SourceAccordion: React.FC<{
  sourceDocs: Document<Record<string, any>>[];
  msgIdx: number;
}> = ({ sourceDocs, msgIdx }) => {
  const accordionEndRef = useRef<HTMLDivElement>(null);

  const uniqueSourceDocs = sourceDocs ? getUniqueSourceDocs(sourceDocs) : [];

  return (
    <div className="" key={`sourceDocsAccordion-${msgIdx}`}>
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
            <h3>Sources</h3>
          </AccordionTrigger>
          <AccordionContent className="container">
            <>
              <ul className="list-disc">
                {uniqueSourceDocs.map((doc, index) => (
                  <li key={`src-${index}`} className="flex flex-col mb-6">
                    <ReactMarkdown linkTarget="_blank">
                      {formatDocumentContent(doc.pageContent)}
                    </ReactMarkdown>
                    <p className="italic">
                      <b>Source:</b> {formatSource(doc.metadata.source)}
                    </p>
                  </li>
                ))}
              </ul>
              <div ref={accordionEndRef} className="h-0" />
            </>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
