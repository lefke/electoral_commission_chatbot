import React, { useRef, useState } from 'react';

export const Header: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
 const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <header className="flex flex-row top-0 z-40 bg-white border-b border-b-slate-200">
        <div className='flex flex-col px-6'>
            {children}
        </div>
    </header>
  );
};