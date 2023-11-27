import React from 'react';

export const Header: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[1] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64">
      <div className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </header>
  );
};
