import React from 'react';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-full justify-end">
 {/*   <h1>Here&apos;s a handy chatbot for when it&apos;s impossible to get through electoral guidance</h1>
    <img src="/robot-ai.png" max-width="180px" height="auto" width="80%" alt="Image of a futuristic advanced robot called 'AI according to the news' "/>
    <h2>Ask the (unofficial) chat bot to do the searching for you</h2>
    <p className='text-sm'>Connected to The Electoral Commission electoral rules and regulations documents</p>
    <p className=' pb-6 text-sm'>(last update: 02/10/2023)</p> */}
    <h3 className="pt-3 text-gray-500">Disclaimer</h3>
    <ul className="pb-3 text-sm text-gray-500 list-disc ">
        <li>The answers provided are not legal advice</li>
        <li>This is an experimental search tool</li>
        <li className=''>Seaching document versions from 02/10/2023</li>
        <li>All data provided should be fact checked with The Electoral Commission tel: 0333 103 1928</li>
    </ul>
    <p className='text-sm'>Built by <a href="https://www.campaignlab.uk">Campaign Lab</a></p>
  </div>
);