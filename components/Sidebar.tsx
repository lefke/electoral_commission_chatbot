import React from 'react';

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {


  return (
    <>
      <div
        id="application-sidebar"
        className={`hidden md:flex flex-auto basis-1/4 w-1/5 grow shrink border-e border-gray-200 pt-7 pb-10 overflow-y-auto end-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 lg:block`}
      >
        <div className="px-6 h-full">{children}</div>
      </div>
    </>
  );
};