import React from 'react';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-full justify-between">
    <h1>
      Here&apos;s a handy chatbot for when it&apos;s impossible to get through
      electoral guidance
    </h1>
    <img
      src="/robot-ai.png"
      max-width="200px"
      width="40%"
      alt="Girl in a jacket"
    />
    <h2>Ask the (unofficial) chat bot to do the searching for you</h2>
    <p>
      Connected to The Electoral Commission electoral rules and regulations
      documents
    </p>
    <p>(last update: 02/10/2023)</p>
    <p>
      Disclaimer: Do not take answers provided as legal advice, this is an
      experimental search tool. All data provided should be fact checked with
      The Electoral Commission tel: 0333 103 1928
    </p>
    <p>Powered by LangChainAI. Built by Campaign Lab</p>
  </div>
);
