import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Title } from './SidebarContent';

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <>
      <div className="lg:hidden border-y px-4 sm:px-6 md:px-8 flex justify-between">
        <Title />
        <SidebarToggle onToggle={handleSidebarToggle} />
      </div>
      <div
        id="application-sidebar"
        className={`fixed ${
          showSidebar ? '' : 'w-0 lg:w-64'
        } transition-[width] top-0 start-0 bottom-0 lg:z-0 z-[60] w-64 bg-ec-blue-900 text-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto end-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 lg:block`}
      >
        <div className="px-6 h-full">{children}</div>
      </div>
    </>
  );
};

const SidebarToggle: React.FC<{ onToggle: () => void }> = ({ onToggle }) => (
  <div className="flex items-center py-4">
    <button
      type="button"
      className="text-gray-500 hover:text-gray-600 lg:hidden"
      data-hs-overlay="#application-sidebar"
      aria-controls="application-sidebar"
      aria-label="Toggle navigation"
      onClick={onToggle}
    >
      <span className="sr-only">Toggle Navigation</span>
      <Bars3Icon className="flex-shrink-0 w-6 h-6" />
    </button>
  </div>
);
