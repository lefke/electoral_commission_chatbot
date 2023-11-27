import React from 'react';

export const Disclaimers: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <ul
    className={`${
      dark ? 'text-white/70' : 'text-gray-500'
    } py-2 px-6 text-sm  list-disc `}
  >
    <li>The answers provided are not legal advice</li>
    <li>This is an experimental search tool</li>
    <li className="">Seaching document versions from 02/10/2023</li>
    <li>
      All data provided should be fact checked with The Electoral Commission
      tel: 0333 103 1928
    </li>
  </ul>
);
