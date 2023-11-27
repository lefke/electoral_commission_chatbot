import React from 'react';

export const Header: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <header className="sticky top-0 inset-x-0 flex flex-col sm:justify-start z-[1] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64">
      <div className="flex flex-col basis-full items-left w-full mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </header>
  );
};
