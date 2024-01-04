import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MessageState } from '@/types/chat';
import styles from '@/styles/Home.module.css';
import LoadingDots from './ui/LoadingDots';
import { ToastMessage } from './ui/ToastMessage';
// import axios from 'axios';

export const MessageInput: React.FC<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
  messageState: MessageState;
  setMessageState: Dispatch<SetStateAction<MessageState>>;
}> = ({ loading, setLoading, messageState, setMessageState }) => {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setconversationId] = useState<string>('');

  const { history } = messageState;

  function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

  useEffect(() => {
    const newconversationId = generateUUID();
    window.localStorage.setItem('conversationId', newconversationId);
    setconversationId(newconversationId);
  }, []);

  useEffect(() => {
    setTimeout(() => error && setError(null), 2500);
  }, [error]);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();
  
    setError(null);
  
    if (!query) {
      alert('Please input a question');
      return;
    }
  
    const question = query.trim();
  
    setLoading(true);
    setQuery('');
  
    try {
      // Send the question to the server and get the response
      const response = await fetch(process.env.CHAT_API_URL || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history: messageState.history,
          conversationId,
        }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
      } else {
        const sourceDocs = data.sourceDocuments || [];
        // Update the local state with the new message and response
        setMessageState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages,
            {
              type: 'userMessage',
              message: question,
            },
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...prevState.history, [question, data.text]],
        }));
      }
    } catch (error) {
      setError('An error occurred while fetching the data. Please try again.');
    } finally {
      setLoading(false);
    }
  }
    // setMessageState((state) => ({
    //   ...state,
    //   messages: [
    //     ...state.messages,
    //     {
    //       type: 'userMessage',
    //       message: question,
    //     },
    //   ],
    // }));

    // setLoading(true);
    // setQuery('');

    // try {
    //   const response = await fetch('/api/chat/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       question,
    //       history,
    //       conversationId,
    //     }),
    //   });
    //   const data = await response.json();

    //   if (data.error) {
    //     setError(data.error);
    //   } else {
    //     setMessageState((state) => ({
    //       ...state,
    //       messages: [
    //         ...state.messages,
    //         {
    //           type: 'apiMessage',
    //           message: data.text,
    //           sourceDocs: data.sourceDocuments,
    //         },
    //       ],
    //       history: [...state.history, [question, data.text]],
    //     }));
    //   }

    //   setLoading(false);

  //   } catch (error) {
  //     setLoading(false);
  //     setError('An error occurred while fetching the data. Please try again.');
  //   }
  // }

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div
      id="input-center"
      className="flex justify-center container align-center px-4 py-0 flex-col -order-1 mt-3 mb-2"
    >
      {error && (
        <div className="border border-red-400 rounded-md p-4 mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <div className={styles.cloudform + ' relative w-full'}>
        <form onSubmit={handleSubmit} className="relative w-full">
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
              loading ? 'Waiting for response...' : 'Ask a question...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.textarea + ' relative w-full'}
          />
          <button
            type="submit"
            disabled={loading}
            className="bottom-5 right-4 text-neutral-400 bg-none p-1.5 border-none absolute "
          >
            {loading ? (
              <div
                className={styles.loadingwheel + ' bottom-2 right-3 absolute'}
              >
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
        <div className="w-full text-center text-xs italic text-gray-400 font-light">
          I am an AI powered search tool, all data provided should be fact
          checked
        </div>
      </div>
    </div>
  );
};
