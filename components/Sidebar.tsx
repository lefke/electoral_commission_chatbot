import React, { useRef, useState } from 'react';

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleSidebarToggle = () => {
    if (sidebarRef.current) {
      sidebarRef.current.style.display =
        sidebarRef.current.style.display === 'block' ? 'none' : 'block';
    }
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden">
        <div className="flex items-center py-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            data-hs-overlay="#application-sidebar"
            aria-controls="application-sidebar"
            aria-label="Toggle navigation"
            onClick={handleSidebarToggle}
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg
              className="flex-shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="application-sidebar"
        ref={sidebarRef}
        className={`fixed ${
          showSidebar ? '' : 'hidden'
        } top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto end-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 lg:block`}
      >
        <button
          onClick={handleSidebarToggle}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 lg:hidden"
        >
          ✕
        </button>
        <div className="px-6 h-full">{children}</div>
      </div>
    </>
  );
};
